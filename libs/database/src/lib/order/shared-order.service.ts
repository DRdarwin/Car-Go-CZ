// libs/order/shared-order.service.ts
import { InjectPubSub } from '@ptc-org/nestjs-query-graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCouponService } from '../coupon/common-coupon.service';
import { CouponEntity } from '../entities/coupon.entity';
import { DriverDeductTransactionType } from '../entities/enums/driver-deduct-transaction-type.enum';
import { DriverRechargeTransactionType } from '../entities/enums/driver-recharge-transaction-type.enum';
import { DriverStatus } from '../entities/enums/driver-status.enum';
import { PaymentStatus } from '../entities/enums/payment-status.enum';
import { ProviderRechargeTransactionType } from '../entities/enums/provider-recharge-transaction-type.enum';
import { RequestActivityType } from '../entities/enums/request-activity-type.enum';
import { RiderDeductTransactionType } from '../entities/enums/rider-deduct-transaction-type.enum';
import { ServiceOptionType } from '../entities/enums/service-option-type.enum';
import { ServicePaymentMethod } from '../entities/enums/service-payment-method.enum';
import { TransactionAction } from '../entities/enums/transaction-action.enum';
import { TransactionStatus } from '../entities/enums/transaction-status.enum';
import { PaymentEntity } from '../entities/payment.entity';
import { RequestActivityEntity } from '../entities/request-activity.entity';
import { ServiceOptionEntity } from '../entities/service-option.entity';
import { ZonePriceEntity } from '../entities/zone-price.entity';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { In, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

import { OrderStatus } from '../entities/enums/order-status.enum';
import { RequestEntity } from '../entities/request.entity';
import { ServiceCategoryEntity } from '../entities/service-category.entity';
import { Point } from '../interfaces/point';
import {
  DriverLocationWithId,
  DriverRedisService,
} from '../redis/driver-redis.service';
import { OrderRedisService } from '../redis/order-redis.service';
import { DriverNotificationService } from './firebase-notification-service/driver-notification.service';
import { RiderNotificationService } from './firebase-notification-service/rider-notification.service';
import { GoogleServicesService } from './google-services/google-services.service';
import { RegionService } from './region/region.service';
import { ServiceService } from './service.service';
import { SharedDriverService } from './shared-driver.service';
import { SharedFleetService } from './shared-fleet.service';
import { SharedProviderService } from './shared-provider.service';
import { SharedRiderService } from './shared-order.service';
import { firstValueFrom } from 'rxjs';
import { ForbiddenError } from '@nestjs/apollo';
import { PaymentMode } from '../entities/enums/payment-mode.enum';
import { VehicleType } from '../entities/enums/vehicle-type.enum'; // NEW: Import VehicleType

@Injectable()
export class SharedOrderService {
  constructor(
    @InjectRepository(RequestEntity)
    private orderRepository: Repository<RequestEntity>,
    @InjectRepository(RequestActivityEntity)
    private activityRepository: Repository<RequestActivityEntity>,
    private regionService: RegionService,
    @InjectRepository(ServiceCategoryEntity)
    private serviceCategoryRepository: Repository<ServiceCategoryEntity>,
    @InjectRepository(ServiceOptionEntity)
    private serviceOptionRepository: Repository<ServiceOptionEntity>,
    @InjectRepository(ZonePriceEntity)
    private zonePriceRepository: Repository<ZonePriceEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    private googleServices: GoogleServicesService,
    private servicesService: ServiceService, // ServiceService is used here
    private riderService: SharedRiderService,
    private driverRedisService: DriverRedisService,
    private orderRedisService: OrderRedisService,
    private driverService: SharedDriverService,
    private sharedProviderService: SharedProviderService,
    private sharedFleetService: SharedFleetService,
    private commonCouponService: CommonCouponService,
    @InjectPubSub()
    private pubSub: RedisPubSub,
    private driverNotificationService: DriverNotificationService,
    private riderNotificationService: RiderNotificationService,
    private httpService: HttpService,
  ) { }

  async getZonePricingsForPoints(
    from: Point,
    to: Point,
  ): Promise<ZonePriceEntity[]> {
    let pricings: ZonePriceEntity[] = await this.zonePriceRepository.query(
      "SELECT * FROM zone_price WHERE ST_Within(st_geomfromtext('POINT(? ?)'), `from`) AND ST_Within(st_geomfromtext('POINT(? ?)'), `to`)",
      [from.lng, from.lat, to.lng, to.lat],
    );
    pricings = await this.zonePriceRepository.find({
      where: { id: In(pricings.map((p) => p.id)) },
      relations: { services: true, fleets: true },
    });
    return pricings;
  }

  // NEW: Assume input DTO now includes vehicleType and loadersCount
  async calculateFare(input: {
    points: Point[];
    vehicleType: VehicleType; // NEW: Added vehicleType
    loadersCount: number; // NEW: Added loadersCount
    twoWay?: boolean;
    coupon?: CouponEntity;
    riderId: number;
    waitTime?: number;
    selectedOptionIds?: string[];
  }) {
    let zonePricings: ZonePriceEntity[] = [];
    if (input.points.length == 2) {
      zonePricings = await this.getZonePricingsForPoints(
        input.points[0],
        input.points[1],
      );
    }
    const regions = await this.regionService.getRegionWithPoint(
      input.points[0],
    );
    if (regions.length < 1) {
      throw new ForbiddenError(CalculateFareError.RegionUnsupported);
    }
    const servicesInRegion = await this.regionService.getRegionServices(
      regions[0].id,
    );
    if (servicesInRegion.length < 1) {
      throw new ForbiddenError(CalculateFareError.NoServiceInRegion);
    }
    if ((input.twoWay ?? false) && input.points.length > 1) {
      input.points.push(input.points[0]);
    }
    const metrics =
      servicesInRegion.findIndex((x) => x.perHundredMeters > 0) > -1 // TODO: Check if perHundredMeters exists for the selected vehicleType
        ? await this.googleServices.getSumDistanceAndDuration(input.points)
        : { distance: 0, duration: 0, directions: [] };

    const cats = await this.serviceCategoryRepository.find({
      relations: ['services', 'services.media', 'services.options'],
    });
    let isResident = process.env.MOTAXI == null;
    if (input.riderId != null) {
      const rider = await this.riderService.findById(input.riderId);
      isResident = rider?.isResident ?? process.env.MOTAXI == null;
    }
    const fleetIdsInPoint = await this.sharedFleetService.getFleetIdsInPoint(
      input.points[0],
    );
    const feeMultiplier =
      (await this.sharedFleetService.getFleetById(fleetIdsInPoint[0]))
        ?.feeMultiplier ?? 1;

    const _cats = cats
      .map((cat) => {
        const { services, ..._cat } = cat;

        const _services = services
          .filter(
            (x) => servicesInRegion.filter((y) => y.id == x.id).length > 0,
          )
          .map(async (service) => { // Changed to async map due to async calculateCost
            let cost;
            const zonePricesWithService = zonePricings.filter(
              (zone) =>
                zone.services.find((_service) => _service.id == service.id) !=
                null,
            );
            if (zonePricesWithService.length > 0) {
              // TODO: Zone pricing might also need vehicleType differentiation
              cost = zonePricesWithService[0].cost;
              const eta = new Date();
              for (const _multiplier of zonePricesWithService[0]
                .timeMultipliers) {
                const startMinutes =
                  parseInt(_multiplier.startTime.split(':')[0]) * 60 +
                  parseInt(_multiplier.startTime.split(':')[1]);
                const nowMinutes = eta.getHours() * 60 + eta.getMinutes();
                const endMinutes =
                  parseInt(_multiplier.endTime.split(':')[0]) * 60 +
                  parseInt(_multiplier.endTime.split(':')[1]);
                if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
                  cost *= _multiplier.multiply;
                }
              }
              // NEW: Add loader cost to zone pricing? Business decision needed.
              // const costPerLoader = 50; // Placeholder
              // cost += input.loadersCount * costPerLoader;
            } else {
              // NEW: Pass vehicleType and loadersCount to calculateCost
              cost = await this.servicesService.calculateCost(
                service,
                metrics.distance,
                metrics.duration,
                new Date(),
                input.vehicleType, // Pass vehicleType
                input.loadersCount, // Pass loadersCount
                feeMultiplier,
                isResident,
              );
            }
            // TODO: Check if waitFee should be calculated differently based on vehicleType/loaders
            const waitFee = service.perMinuteWait * (input.waitTime ?? 0);
            const finalCost = cost + waitFee; // Includes base cost + loaders + wait

            if (input.coupon == null) {
              return {
                ...service,
                cost: finalCost,
              };
            } else {
              const costAfterCoupon =
                this.commonCouponService.applyCouponOnPrice(
                  input.coupon,
                  finalCost,
                );
              return {
                ...service,
                cost: finalCost,
                costAfterCoupon,
              };
            }
          });
        return {
          ..._cat,
          // Await all promises from the async map
          services: Promise.all(_services),
        };
      })
      .filter(async (x) => (await x.services).length > 0); // Filter based on resolved services

    // Resolve the categories and services promises
    const resolvedCats = await Promise.all(
      _cats.map(async (cat) => ({
        ...cat,
        services: await cat.services,
      })),
    );

    Logger.log(`_services: ${JSON.stringify(resolvedCats)}`, 'calculateFare');
    Logger.log(`metrics: ${JSON.stringify(metrics)}`, 'calculateFare');

    return {
      ...metrics,
      currency: regions[0].currency,
      services: resolvedCats,
    };
  }

  // NEW: Assume input DTO now includes vehicleType and loadersCount
  async createOrder(input: {
    riderId?: number;
    serviceId: number;
    vehicleType: VehicleType; // NEW: Added vehicleType
    loadersCount: number; // NEW: Added loadersCount
    intervalMinutes: number;
    points: Point[];
    addresses: string[];
    operatorId?: number;
    twoWay?: boolean;
    optionIds?: string[];
    couponCode?: string;
    fleetId?: number;
    paymentMode?: PaymentMode;
    paymentMethodId?: number;
    waitMinutes: number;
  }): Promise<RequestEntity> {
    let zonePricings: ZonePriceEntity[] = [];
    if (input.points.length == 2) {
      zonePricings = await this.getZonePricingsForPoints(
        input.points[0],
        input.points[1],
      );
    }
    const service = await this.servicesService.getWithId(input.serviceId);
    if (service == undefined) {
      throw new ForbiddenError('SERVICE_NOT_FOUND');
    }
    const closeDrivers = await this.driverRedisService.getClose(
      input.points[0],
      service.searchRadius, // TODO: searchRadius might depend on vehicleType?
    );
    Logger.log(`closeDrivers: ${JSON.stringify(closeDrivers)}`, 'createOrder');
    const driverIds = closeDrivers.map((x: DriverLocationWithId) => x.driverId);
    const fleetIdsInPoint = await this.sharedFleetService.getFleetIdsInPoint(
      input.points[0],
    );
    // TODO: Filter drivers based on their ability to handle the required vehicleType
    const driversWithService =
      await this.driverService.getOnlineDriversWithServiceId(
        driverIds,
        input.serviceId,
        fleetIdsInPoint,
      );
    Logger.log(
      `driversWithService: ${JSON.stringify(driversWithService)}`,
      'createOrder',
    );

    let optionFee = 0;
    let options: ServiceOptionEntity[] = [];
    if (input.optionIds != null) {
      options = await this.serviceOptionRepository.findByIds(input.optionIds);
      if ((input.twoWay ?? false) && input.points.length > 1) {
        input.points.push(input.points[0]);
        input.addresses.push(input.addresses[0]);
      }
      const paidOptions = options.filter(
        (option) => option.type == ServiceOptionType.Paid,
      );
      optionFee =
        paidOptions.length == 0
          ? 0
          : paidOptions
            .map((option) => option.additionalFee ?? 0)
            .reduce(
              (previous: number, current: number) => (current += previous),
            );
    }
    const metrics =
      // TODO: Check if perHundredMeters exists for the selected vehicleType
      service.perHundredMeters > 0
        ? await this.googleServices.getSumDistanceAndDuration(input.points)
        : { distance: 0, duration: 0, directions: [] };

    const eta = new Date(
      new Date().getTime() + (input.intervalMinutes | 0) * 60 * 1000,
    );
    const rider =
      input.riderId == null
        ? null
        : await this.riderService.findById(input.riderId);
    const isResident = rider?.isResident ?? process.env.MOTAXI == null;
    const feeMultiplier =
      fleetIdsInPoint.length == 0
        ? 1
        : (await this.sharedFleetService.getFleetById(fleetIdsInPoint[0]))
          ?.feeMultiplier ?? 1;

    let cost;
    const zonePricing = zonePricings.filter((price) => {
      return (
        price.services.filter((service) => service.id == input.serviceId)
          .length > 0
      );
    });

    if (zonePricing.length > 0) {
      // TODO: Zone pricing might also need vehicleType differentiation
      cost = zonePricing[0].cost;
      const eta = new Date();
      for (const _multiplier of zonePricings[0].timeMultipliers) {
        const startMinutes =
          parseInt(_multiplier.startTime.split(':')[0]) * 60 +
          parseInt(_multiplier.startTime.split(':')[1]);
        const nowMinutes = eta.getHours() * 60 + eta.getMinutes();
        const endMinutes =
          parseInt(_multiplier.endTime.split(':')[0]) * 60 +
          parseInt(_multiplier.endTime.split(':')[1]);
        if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
          cost *= _multiplier.multiply;
        }
      }
      // NEW: Add loader cost to zone pricing? Business decision needed.
      // const costPerLoader = 50; // Placeholder
      // cost += input.loadersCount * costPerLoader;
    } else {
      // NEW: Pass vehicleType and loadersCount to calculateCost
      cost = await this.servicesService.calculateCost(
        service,
        metrics.distance,
        metrics.duration,
        eta,
        input.vehicleType, // Pass vehicleType
        input.loadersCount, // Pass loadersCount
        feeMultiplier,
        isResident,
      );
    }

    // TODO: Check if waitCost calculation depends on vehicleType/loaders
    const waitCost = service.perMinuteWait * input.waitMinutes;
    const finalCost = cost + optionFee + waitCost; // Base (+loaders) + options + wait

    const regions = await this.regionService.getRegionWithPoint(
      input.points[0],
    );
    // TODO: Check if maximumDestinationDistance depends on vehicleType
    if (
      service.maximumDestinationDistance != 0 &&
      metrics.distance > service.maximumDestinationDistance
    ) {
      throw new ForbiddenError('DISTANCE_TOO_FAR');
    }
    let shouldPrePay = false;
    const paidAmount = 0;
    // TODO: Check if prepay logic depends on vehicleType/loaders
    if (service.prepayPercent > 0 && input.riderId != null) {
      const balance = await this.riderService.getRiderCreditInCurrency(
        input.riderId,
        regions[0].currency,
      );
      const amountNeedsToBePrePaid = (finalCost * service.prepayPercent) / 100;
      if (balance < amountNeedsToBePrePaid) {
        shouldPrePay = true;
      }
    }
    // TODO: Check if providerShare logic depends on vehicleType/loaders
    const providerShare =
      service.providerShareFlat + (service.providerSharePercent * finalCost) / 100;


    const orderObject: Partial<RequestEntity> = { // Use Partial<RequestEntity> for create
      serviceId: input.serviceId,
      vehicleType: input.vehicleType, // NEW: Save vehicleType
      loadersCount: input.loadersCount, // NEW: Save loadersCount
      currency: regions[0].currency,
      riderId: input.riderId,
      points: input.points,
      addresses: input.addresses.map((address) => address.replace(', ', '-')),
      distanceBest: metrics.distance,
      durationBest: metrics.duration,
      directions: metrics.directions,
      paymentMode: input.paymentMode,
      savedPaymentMethodId:
        input.paymentMode == PaymentMode.SavedPaymentMethod
          ? input.paymentMethodId!
          : undefined,
      paymentGatewayId:
        input.paymentMode == PaymentMode.PaymentGateway
          ? input.paymentMethodId!
          : undefined,
      status: shouldPrePay
        ? OrderStatus.WaitingForPrePay
        : input.intervalMinutes > 30
          ? OrderStatus.Booked
          : driversWithService.length < 1
            ? OrderStatus.NoCloseFound // TODO: Check driver availability for vehicle type
            : OrderStatus.Requested,
      paidAmount: paidAmount,
      costBest: finalCost, // Use the final calculated cost
      costAfterCoupon: finalCost, // Initial value, coupon applied later
      expectedTimestamp: eta,
      operatorId: input.operatorId,
      waitMinutes: input.waitMinutes,
      waitCost: waitCost,
      rideOptionsCost: optionFee,
      fleetId: input.fleetId,
      providerShare: providerShare,
      options: options,
    };

    let order = await this.orderRepository.save(orderObject as RequestEntity); // Cast to RequestEntity
    if (input.couponCode != null && input.couponCode != '' && rider != null) {
      order = await this.commonCouponService.applyCoupon(
        input.couponCode,
        order.id,
        rider.id,
      );
    }
    let activityType = RequestActivityType.RequestedByRider;
    if (input.intervalMinutes > 0) {
      activityType =
        input.operatorId == null
          ? (activityType = RequestActivityType.BookedByRider)
          : RequestActivityType.BookedByOperator;
    } else {
      activityType =
        input.operatorId == null
          ? (activityType = RequestActivityType.RequestedByRider)
          : RequestActivityType.RequestedByOperator;
    }
    this.activityRepository.insert({ requestId: order.id, type: activityType });

    // TODO: Add vehicleType/loadersCount to order data stored in Redis?
    await this.orderRedisService.add(
      { ...order, fleetIds: fleetIdsInPoint },
      input.intervalMinutes | 0,
    );

    Logger.log(`publishing order: ${order.id}`, 'createOrder');
    Logger.log(
      `driversWithService: ${JSON.stringify(driversWithService)}`,
      'createOrder',
    );
    // TODO: Check driver availability for vehicle type before notifying
    if ((input.intervalMinutes ?? 0) < 30 && !shouldPrePay) {
      this.orderRedisService.driverNotified(order.id, driversWithService);
      this.pubSub.publish('orderCreated', {
        orderCreated: order,
        driverIds: driversWithService.map((driver) => driver.id),
      });
      this.driverNotificationService.requests(driversWithService);
    }
    return order;
  }

  async processPrePay(orderId: number, authorizedAmount: number = 0) {
    // ... (rest of the method - might need adjustments if prepay logic changed)
    // Need to re-fetch order to ensure latest data after potential updates
    const order: RequestEntity = await this.orderRepository.findOneOrFail({
      where: { id: orderId },
      relations: ['service', 'driver', 'driver.fleet', 'rider'],
    });
    const riderCredit = await this.riderService.getRiderCreditInCurrency(
      order.riderId,
      order.currency,
    );
    Logger.log(`riderCredit: ${riderCredit}`, 'processPrePay');
    Logger.log(`authorizedAmount: ${authorizedAmount}`, 'processPrePay');
    Logger.log(`serviceFee: ${order.costAfterCoupon}`, 'processPrePay');
    Logger.log(
      `Minmum required authorizedAmount: ${order.costAfterCoupon * (order.service.prepayPercent / 100.0)
      }`,
      'processPrePay',
    );
    // Use >= 0 instead of > 1 for check
    if (
      riderCredit +
      authorizedAmount <
      order.costAfterCoupon * (order.service.prepayPercent / 100.0)
    ) {
      throw new ForbiddenError('Credit is not enough');
    }
    await this.orderRepository.update(order.id, {
      status: OrderStatus.Requested,
    });
    const closeDriverIds = (
      await this.driverRedisService.getClose(
        order.points[0],
        order.service.searchRadius,
      )
    ).map((x: DriverLocationWithId) => x.driverId);
    const fleetIdsInPoint = await this.sharedFleetService.getFleetIdsInPoint(
      order.points[0],
    );
    // TODO: Filter drivers based on vehicleType capability
    const driversWithService =
      await this.driverService.getOnlineDriversWithServiceId(
        closeDriverIds,
        order.serviceId,
        fleetIdsInPoint,
      );
    this.orderRedisService.driverNotified(order.id, driversWithService);
    this.pubSub.publish('orderCreated', {
      orderCreated: order, // Send the fetched order object
      driverIds: driversWithService.map((driver) => driver.id),
    });
    this.driverNotificationService.requests(driversWithService);
    // Refetch order after update to return latest status
    return this.orderRepository.findOneOrFail({
      where: { id: orderId },
      relations: ['service', 'driver', 'driver.fleet', 'rider'],
    });
  }

  async finish(orderId: number, cashAmount = 0.0) {
    // ... (rest of the method - might need minor adjustments based on final cost calculation)
    const order: RequestEntity = await this.orderRepository.findOneOrFail({
      where: { id: orderId },
      relations: ['service', 'driver', 'driver.fleet', 'rider'],
    });
    if (
      order.service.paymentMethod == ServicePaymentMethod.OnlyCredit &&
      cashAmount > 0
    ) {
      throw new ForbiddenError(
        'Cash payment is not available for this service.',
      );
    }
    let riderCredit = await this.riderService.getRiderCreditInCurrency(
      order.riderId,
      order.currency,
    );
    // TODO: Re-evaluate commission calculation based on vehicleType/loaders if needed
    const providerPercent =
      order.rider.isResident === false
        ? order.service.providerSharePercent * order.service.touristMultiplier
        : order.service.providerSharePercent;
    const commission = order.providerShare; // Use the pre-calculated providerShare
    let unPaidAmount =
      order.costAfterCoupon - order.paidAmount + order.tipAmount; // Use costAfterCoupon

    if (riderCredit + cashAmount < unPaidAmount) {
      const payment = await this.paymentRepository.find({
        where: {
          userType: 'client',
          userId: order.riderId.toString(),
          status: PaymentStatus.Authorized,
          orderNumber: order.id.toString(),
        },
        order: { id: 'DESC' },
      });
      const status = OrderStatus.WaitingForPostPay;
      if (payment.length > 0) {
        const amountToCapture = Math.max(0, unPaidAmount - riderCredit); // Capture only the needed amount >= 0
        if (amountToCapture > 0) {
          try {
            const captureResult = await firstValueFrom(
              this.httpService.get<{ status: 'OK' | 'FAILED' }>(
                `${process.env.GATEWAY_SERVER_URL}/capture?id=${payment[0].transactionNumber
                }&amount=${amountToCapture}`,
              ),
            );
            if (captureResult.data.status == 'OK') {
              // Re-fetch credit after potential successful capture
              riderCredit = await this.riderService.getRiderCreditInCurrency(
                order.riderId,
                order.currency,
              );
              // Recalculate unpaid amount
              unPaidAmount =
                order.costAfterCoupon - order.paidAmount + order.tipAmount;
              if (riderCredit + cashAmount < unPaidAmount) {
                // Still not enough after capture attempt
                await this.orderRepository.update(order.id, { status });
                return; // Exit function
              }
              // If enough now, proceed with finishing logic below
            } else {
              // Capture failed
              await this.orderRepository.update(order.id, { status });
              return; // Exit function
            }
          } catch (error) {
            Logger.error(`Payment capture failed for order ${orderId}`, error);
            await this.orderRepository.update(order.id, { status });
            return; // Exit function
          }
        } else {
          // Amount to capture is 0 or less, proceed normally
        }
      } else {
        // No authorized payment found
        await this.orderRepository.update(order.id, { status });
        return; // Exit function
      }
    }

    // Sufficient funds available (Wallet + Cash + Captured Amount)

    await this.driverService.rechargeWallet({
      status: TransactionStatus.Done,
      driverId: order.driverId!,
      currency: order.currency,
      action: TransactionAction.Deduct,
      deductType: DriverDeductTransactionType.Commission,
      amount: -1 * commission,
      requestId: order.id,
    });

    let fleetShare = 0;
    if (order.driver?.fleetId != null) {
      fleetShare =
        (commission * order.driver.fleet!.commissionSharePercent) / 100 +
        order.driver.fleet!.commissionShareFlat;
      if (fleetShare > 0) {
        this.sharedFleetService.rechargeWallet({
          fleetId: order.driver.fleetId,
          action: TransactionAction.Recharge,
          rechargeType: ProviderRechargeTransactionType.Commission,
          amount: fleetShare,
          currency: order.currency,
          requestId: order.id,
          driverId: order.driverId,
        });
      }
    }
    await this.sharedProviderService.rechargeWallet({
      action: TransactionAction.Recharge,
      rechargeType: ProviderRechargeTransactionType.Commission,
      currency: order.currency,
      amount: commission - fleetShare,
    });

    // Calculate amount to charge driver wallet (fee + tip - cash received)
    const amountToChargeDriver = order.costAfterCoupon + order.tipAmount - cashAmount;

    if (amountToChargeDriver > 0) {
      await this.driverService.rechargeWallet({
        status: TransactionStatus.Done,
        driverId: order.driverId!,
        currency: order.currency,
        requestId: order.id,
        action: TransactionAction.Recharge,
        rechargeType: DriverRechargeTransactionType.OrderFee,
        amount: amountToChargeDriver, // Driver gets the fee & tip
      });
    }

    // Calculate amount to deduct from rider wallet (remaining fee + tip after cash)
    const amountToDeductRider = Math.max(0, unPaidAmount - cashAmount);

    if (amountToDeductRider > 0 && riderCredit > 0) {
      const deductAmount = Math.min(riderCredit, amountToDeductRider); // Deduct only available credit or needed amount
      await this.riderService.rechargeWallet({
        status: TransactionStatus.Done,
        action: TransactionAction.Deduct,
        deductType: RiderDeductTransactionType.OrderFee,
        currency: order.currency,
        requestId: order.id,
        amount: -1 * deductAmount, // Deduct the calculated amount
        riderId: order.riderId,
      });
    }

    await this.orderRepository.update(order.id, {
      paidAmount: order.costAfterCoupon + order.tipAmount, // Update paid amount fully
      status: OrderStatus.WaitingForReview,
      finishTimestamp: new Date(),
    });
    await this.driverService.updateDriverStatus(
      order.driverId!,
      DriverStatus.Online,
    );
    this.activityRepository.insert({
      requestId: order.id,
      type: RequestActivityType.Paid,
    });
  }

  async assignOrderToDriver(orderId: number, driverId: number) {
    // ... (rest of the method - check if driver vehicle matches order vehicleType)
    const [travel, driverLocation] = await Promise.all([
      this.orderRepository.findOneOrFail({
        where: { id: orderId },
        // NEW: Eager load vehicleType if needed for checks
        relations: ['driver', 'driver.car', 'driver.carColor', 'service', 'rider'],
      }),
      this.driverRedisService.getDriverCoordinate(driverId),
    ]);

    // NEW: Add check if driver's vehicle type matches the order's required vehicleType
    // const driver = await this.driverService.findById(driverId); // Fetch driver details including vehicle
    // if(driver.vehicle.type !== travel.vehicleType) { // Pseudo-code
    //   throw new ForbiddenError('Driver vehicle type mismatch');
    // }


    this.activityRepository.insert({
      requestId: orderId,
      type: RequestActivityType.DriverAccepted,
    });
    // Simplified check: if already accepted or finished, throw error
    if (travel.driverId != null || [OrderStatus.Finished, OrderStatus.WaitingForReview, OrderStatus.WaitingForPostPay].includes(travel.status)) {
      throw new ForbiddenError('Order is already assigned or finished.');
    }

    // Cancel previous driver if any (though logic above should prevent this state)
    // if (travel.driverId != null && travel.driverId !== driverId) {
    //    this.driverNotificationService.canceled(travel.driver!);
    //    await this.driverService.updateDriverStatus(
    //      travel.driverId,
    //      DriverStatus.Online,
    //    );
    // }

    const metrics =
      driverLocation != null
        ? await this.googleServices.getSumDistanceAndDuration([
          travel.points[0],
          driverLocation,
        ])
        : { distance: 0, duration: 0 };
    const dt = new Date();
    const etaPickup = dt.setSeconds(dt.getSeconds() + metrics.duration);
    this.driverService.updateDriverStatus(driverId, DriverStatus.InService);
    await this.orderRedisService.expire([orderId]);
    await this.orderRepository.update(orderId, {
      status: OrderStatus.DriverAccepted,
      etaPickup: new Date(etaPickup),
      driverId,
    });
    // Fetch the updated order again to ensure all relations are loaded for notifications/publish
    const result = await this.orderRepository.findOneOrFail({
      where: { id: orderId },
      relations: [
        'driver',
        'driver.car',
        'driver.carColor',
        'service',
        'rider',
        // Eager load vehicleType if needed for notifications
        // 'vehicleType'
      ],
    });
    this.pubSub.publish('orderUpdated', { orderUpdated: result });
    this.pubSub.publish('orderRemoved', { orderRemoved: result });
    this.riderNotificationService.bookingAssigned(
      result.rider,
      result.expectedTimestamp.toISOString(),
      // NEW: Potentially add vehicle info to notification
      // result.driver?.car?.name,
      // result.driver?.plateNumber
    );
    this.driverNotificationService.assigned(
      result.driver!,
      result.expectedTimestamp.toTimeString(),
      result.addresses[0],
      result.addresses[result.addresses.length - 1],
      // NEW: Potentially add loadersCount to notification
      // result.loadersCount
    );
    return result;
  }
}

enum CalculateFareError {
  RegionUnsupported = 'REGION_UNSUPPORTED',
  NoServiceInRegion = 'NO_SERVICE_IN_REGION',
}