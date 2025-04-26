// apps/rider-api/src/app/order/order.resolver.ts
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Args, CONTEXT, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonCouponService } from '@ridy/coupon';
import { Point } from '@ridy/database';
import { RequestEntity } from '@ridy/database/request.entity';
import { SharedOrderService } from '@ridy/order/shared-order.service';
import { DriverRedisService } from '@ridy/redis/driver-redis.service';
import { UserContextOptional } from '../auth/authenticated-user';
import { GqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { GqlOptionalAuthGuard } from '../auth/jwt-optional-gql-auth.guard';
import { CalculateFareDTO } from './dto/calculate-fare.dto';
import { CalculateFareInput } from './dto/calculate-fare.input'; // Updated DTO
import { CreateOrderInput } from './dto/create-order.input'; // Updated DTO
import { CurrentOrder } from './dto/current-order.dto';
import { OrderDTO } from './dto/order.dto';
import { SubmitFeedbackInput } from './dto/submit-feedback.input';
import { RiderOrderService } from './rider-order.service';

@Resolver(() => OrderDTO)
export class OrderResolver {
  constructor(
    @Inject(CONTEXT) private context: UserContextOptional,
    private orderService: SharedOrderService,
    private riderOrderService: RiderOrderService,
    private driverRedisService: DriverRedisService,
    private commonCouponService: CommonCouponService,
  ) { }

  @Query(() => OrderDTO, {
    nullable: true,
  })
  @UseGuards(GqlAuthGuard)
  async currentOrder(): Promise<OrderDTO> {
    return this.riderOrderService.getCurrentOrder(this.context.req.user.id, [
      'driver',
      'driver.carColor',
      'driver.car',
      'conversation',
      // NEW: Optionally include vehicleType and loadersCount if needed in currentOrder DTO
      // 'vehicleType' // Make sure OrderDTO includes this if needed
    ]);
  }

  @Query(() => CurrentOrder)
  @UseGuards(GqlAuthGuard)
  async currentOrderWithLocation(): Promise<CurrentOrder> {
    const order = await this.riderOrderService.getCurrentOrder(
      this.context.req.user.id,
      ['driver', 'driver.carColor', 'driver.car'],
      // NEW: Optionally include vehicleType and loadersCount if needed
    );
    let driverLocation;
    if (order?.driver != null) {
      driverLocation = await this.driverRedisService.getDriverCoordinate( // Added await
        order.driver.id,
      );
    }
    return { order, driverLocation };
  }

  // Deprecated? Uses GqlAuthGuard but named like getFare. Keeping logic similar to getFare.
  @Mutation(() => CalculateFareDTO)
  @UseGuards(GqlAuthGuard)
  async calculateFare(
    @Args('input', { type: () => CalculateFareInput })
    input: CalculateFareInput, // Uses updated DTO
  ): Promise<CalculateFareDTO> {
    const coupon = input.couponCode
      ? await this.commonCouponService.checkCoupon(
        input.couponCode,
        this.context.req.user?.id,
      )
      : undefined;
    // NEW: Pass vehicleType and loadersCount from input
    return this.orderService.calculateFare({
      points: input.points,
      vehicleType: input.vehicleType,
      loadersCount: input.loadersCount,
      coupon: coupon,
      riderId: this.context.req.user?.id,
      twoWay: input.twoWay,
      waitTime: input.waitTime,
      selectedOptionIds: input.selectedOptionIds,
    });
  }

  // Deprecated? Seems identical to getFare
  @Query(() => CalculateFareDTO)
  @UseGuards(GqlAuthGuard)
  async getFares(
    @Args('input', { type: () => CalculateFareInput })
    input: CalculateFareInput, // Uses updated DTO
  ): Promise<CalculateFareDTO> {
    Logger.log(`Getting fares for userId:${this.context.req.user?.id}`);
    let coupon;
    if (
      input.couponCode != null &&
      this.context.req.user?.id != null &&
      input.couponCode.length > 0
    ) {
      coupon = await this.commonCouponService.checkCoupon(input.couponCode);
    }
    // NEW: Pass vehicleType and loadersCount from input
    return this.orderService.calculateFare({
      points: input.points,
      vehicleType: input.vehicleType,
      loadersCount: input.loadersCount,
      coupon: coupon,
      riderId: this.context.req.user?.id,
      twoWay: input.twoWay,
      waitTime: input.waitTime,
      selectedOptionIds: input.selectedOptionIds,
    });
  }

  @Query(() => CalculateFareDTO)
  @UseGuards(GqlOptionalAuthGuard)
  async getFare(
    @Args('input', { type: () => CalculateFareInput })
    input: CalculateFareInput, // Uses updated DTO
  ): Promise<CalculateFareDTO> {
    Logger.log(`Getting fare for userId:${this.context.req.user?.id}`);
    let coupon;
    if (
      input.couponCode != null &&
      this.context.req.user?.id != null &&
      input.couponCode.length > 0
    ) {
      coupon = await this.commonCouponService.checkCoupon(input.couponCode);
    }
    // NEW: Pass vehicleType and loadersCount using spread operator
    // Assuming calculateFare input object matches CalculateFareInput structure now
    return this.orderService.calculateFare({
      ...input, // Includes vehicleType and loadersCount from updated DTO
      coupon,
      riderId: this.context.req.user?.id,
    });
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @Args('input', { type: () => CreateOrderInput }) input: CreateOrderInput, // Uses updated DTO
  ): Promise<OrderDTO> {
    // NEW: Pass vehicleType and loadersCount using spread operator
    // Assuming createOrder input object matches CreateOrderInput structure now
    return this.orderService.createOrder({
      ...input, // Includes vehicleType and loadersCount from updated DTO
      riderId: this.context.req.user.id,
      optionIds: input.optionIds,
      waitMinutes: input.waitTime, // Map waitTime from input to waitMinutes for service
      twoWay: input.twoWay,
    });
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async cancelOrder(
    @Args('orderId', { type: () => ID, nullable: true }) orderId?: number,
    @Args('cancelReasonId', { type: () => ID, nullable: true })
    cancelReasonId?: number,
    @Args('cancelReasonNote', { type: () => String, nullable: true })
    cancelReasonNote?: string,
  ): Promise<OrderDTO> {
    if (orderId != null) {
      return this.riderOrderService.cancelOrder({
        orderId: orderId,
        reasonId: cancelReasonId,
        reason: cancelReasonNote,
      });
    } else {
      return this.riderOrderService.cancelRiderLastOrder({
        riderId: this.context.req.user.id,
        reasonId: cancelReasonId,
        reason: cancelReasonNote,
      });
    }
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async cancelBooking(
    @Args('id', { type: () => ID }) id: number,
    @Args('cancelReasonId', { type: () => ID!, nullable: true })
    cancelReasonId?: number,
    @Args('cancelReasonNote', { type: () => String, nullable: true })
    cancelReasonNote?: string,
  ): Promise<OrderDTO> {
    return this.riderOrderService.cancelOrder({
      orderId: id,
      reasonId: cancelReasonId,
      reason: cancelReasonNote,
    });
  }

  @Query(() => Point, {
    nullable: true,
  })
  @UseGuards(GqlAuthGuard)
  async getCurrentOrderDriverLocation(): Promise<Point | null> { // Return type should be Point | null
    const order = await this.riderOrderService.getCurrentOrder(
      this.context.req.user.id,
    );
    if (order?.driverId != null) {
      Logger.log(`driver id: ${order.driverId}`);
      const coordinate = await this.driverRedisService.getDriverCoordinate( // Added await
        order.driverId,
      );
      Logger.log(JSON.stringify(coordinate));
      return coordinate;
    } else {
      return null;
    }
  }

  @Query(() => [Point], {})
  async getDriversLocation(
    @Args('center', { type: () => Point, nullable: true }) center?: Point,
  ): Promise<Point[]> {
    if (center == null) return [];
    return this.driverRedisService.getCloseWithoutIds(center, 1000);
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async submitReview(
    @Args('review', { type: () => SubmitFeedbackInput })
    review: SubmitFeedbackInput,
  ): Promise<RequestEntity> {
    return this.riderOrderService.submitReview(
      this.context.req.user.id,
      review,
    );
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async skipReview(): Promise<RequestEntity> {
    return this.riderOrderService.skipReview(this.context.req.user.id);
  }
}