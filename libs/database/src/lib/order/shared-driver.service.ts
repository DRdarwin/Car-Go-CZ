// libs/database/src/lib/services/shared-driver.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { DriverTransactionEntity } from '../entities/driver-transaction.entity';
import { DriverWalletEntity } from '../entities/driver-wallet.entity';
import { DriverEntity } from '../entities/driver.entity';
import { DriverStatus } from '../entities/enums/driver-status.enum';
import { VehicleType } from '../entities/enums/vehicle-type.enum'; // NEW: Import VehicleType

@Injectable()
export class SharedDriverService {
  constructor(
    @InjectRepository(DriverEntity)
    public driverRepo: Repository<DriverEntity>,
    @InjectRepository(DriverWalletEntity)
    private driverWalletRepo: Repository<DriverWalletEntity>,
    @InjectRepository(DriverTransactionEntity)
    private driverTransactionRepo: Repository<DriverTransactionEntity>,
  ) { }

  async findById(id: number): Promise<DriverEntity> {
    return this.driverRepo.findOneOrFail({
      where: { id },
      relations: {
        enabledServices: true,
        vehicle: true, // NEW: Ensure vehicle relation is loaded if needed elsewhere
        // vehicle.type might need explicit relation loading depending on setup
      },
      withDeleted: true,
    });
  }

  async updateDriverStatus(driverId: number, status: DriverStatus) {
    return this.driverRepo.update(driverId, { status });
  }

  async getMaxRadiusForDriverServices(driverId: number): Promise<number> {
    // This logic might need revisiting if searchRadius becomes vehicle-specific
    const driver = await this.driverRepo.findOneOrFail({
      where: { id: driverId },
      relations: { enabledServices: true },
    });
    // Assuming searchRadius remains on ServiceEntity for now
    const radiuses = driver!.enabledServices.map(
      (service) => service.searchRadius,
    );
    const max = Math.max(...radiuses);
    return max > 0 ? max : 0;
  }

  async getOnlineDriversWithServiceId(
    driverIds: number[],
    serviceId: number,
    vehicleType: VehicleType, // NEW: Added vehicleType parameter
    fleetIds: number[] = [],
  ): Promise<DriverEntity[]> { // Return type is Promise<DriverEntity[]>
    Logger.log(
      `Finding drivers with service ${serviceId} and vehicle type ${vehicleType}`,
      'SharedDriverService',
    );
    Logger.log(`DriverIds: ${driverIds}`, 'SharedDriverService');
    Logger.log(`FleetIds: ${fleetIds}`, 'SharedDriverService');

    if (!driverIds || driverIds.length === 0) {
      return []; // Return early if no driver IDs provided
    }

    const queryBuilder = this.driverRepo.createQueryBuilder('driver')
      .leftJoinAndSelect('driver.enabledServices', 'service')
      .leftJoinAndSelect('driver.vehicle', 'vehicle') // NEW: Join vehicle relation
      .where('driver.id IN (:...driverIds)', { driverIds })
      .andWhere('driver.status = :status', { status: DriverStatus.Online })
      .andWhere('service.id = :serviceId', { serviceId }); // Filter by enabled service first

    if (fleetIds.length > 0) {
      queryBuilder.andWhere('driver.fleetId IN (:...fleetIds)', { fleetIds });
    }

    const driversFound = await queryBuilder.getMany();

    // NEW: Filter by vehicle type
    const driversWithVehicleType = driversFound.filter(driver =>
      driver.vehicle?.type === vehicleType // Check if driver's vehicle type matches requested type
    );

    Logger.log(`Found ${driversWithVehicleType.length} drivers with service ${serviceId} and vehicle type ${vehicleType}`, 'SharedDriverService');

    return driversWithVehicleType;
  }


  async canDriverDoServiceAndFleet(
    driverId: number,
    serviceId: number,
    vehicleType: VehicleType, // NEW: Added vehicleType parameter
    fleetIds: number[] = [],
  ): Promise<boolean> {
    const drivers = await this.getOnlineDriversWithServiceId(
      [driverId],
      serviceId,
      vehicleType, // NEW: Pass vehicleType
      fleetIds,
    );
    return drivers.length > 0;
  }


  async rechargeWallet(
    transaction: Pick<
      DriverTransactionEntity,
      | 'status'
      | 'action'
      | 'rechargeType'
      | 'deductType'
      | 'amount'
      | 'currency'
      | 'driverId'
      | 'requestId'
      | 'operatorId'
      | 'paymentGatewayId'
      | 'refrenceNumber'
      | 'description'
      | 'giftCardId'
    >,
  ) {
    let wallet = await this.driverWalletRepo.findOneBy({
      driverId: transaction.driverId,
      currency: transaction.currency,
    });
    transaction.amount = parseFloat(transaction.amount.toString());
    if (wallet == null) {
      wallet = await this.driverWalletRepo.save({
        balance: transaction.amount,
        currency: transaction.currency,
        driverId: transaction.driverId,
      });
    } else {
      await this.driverWalletRepo.update(wallet.id, {
        balance:
          parseFloat(transaction.amount.toString()) +
          parseFloat(wallet.balance.toString()),
      });
      wallet.balance += transaction.amount;
    }
    if (transaction.amount != 0) {
      Logger.log(`Saving transaction ${JSON.stringify(transaction)}`);
      await this.driverTransactionRepo.save(transaction); // Added await
    }
    return wallet;
  }

  async setRating(driverId: number, rating: number, totalRatingCount: number) {
    return this.driverRepo.update(driverId, {
      rating: rating,
      reviewCount: totalRatingCount,
    });
  }

  async deleteById(id: number): Promise<DriverEntity> {
    const user = await this.findById(id);
    await this.driverRepo.softDelete(id);
    return user;
  }
}