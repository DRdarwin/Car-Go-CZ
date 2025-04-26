// libs/order/service.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity } from '../entities/service.entity';
import { Repository } from 'typeorm';
import { VehicleType } from '../entities/enums/vehicle-type.enum';
import { VehicleTariff, VehicleTariffs } from '../interfaces/vehicle-type.enum';
// NEW: Import SettingService and the key constant
import { SettingService, LOADER_COST_PER_HOUR_KEY } from '../../common/src/setting/setting.service'; // Adjust path if common lib is located differently

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private serviceRepo: Repository<ServiceEntity>,
    // NEW: Inject SettingService
    private settingService: SettingService,
  ) { }

  async calculateCost(
    service: ServiceEntity,
    distance: number,
    duration: number,
    eta: Date,
    vehicleType: VehicleType,
    loadersCount: number,
    fleetMultiplier: number = 1,
    isResident: boolean = true,
  ): Promise<number> {

    const tariff: VehicleTariff | undefined = service.vehicleTariffs?.[vehicleType];

    if (!tariff) {
      Logger.error(`Tariff not found for serviceId: ${service.id} and vehicleType: ${vehicleType}`);
      throw new NotFoundException(`Tariff configuration missing for service ${service.name} and vehicle type ${vehicleType}`);
    }

    const { baseFare, perHundredMeters, perMinuteDrive, minimumFee } = tariff;

    // NEW: Fetch loader cost using SettingService
    const costPerLoader = await this.settingService.getLoaderCostPerHour(); // Replaced placeholder
    // TODO: Decide if costPerLoader should be per hour or per trip. Assuming per trip for now.
    // If per hour, needs duration multiplication: loadersCost = loadersCount * costPerLoader * (duration / 3600);
    const loadersCost = loadersCount * costPerLoader;

    let i = baseFare;
    let multiplier = 1;

    console.log(
      `Calculating Cargo Delivery fee with base fare ${i} for ${vehicleType}, distance ${distance}m, duration ${duration}s, loaders: ${loadersCount}`,
    );

    i +=
      (perHundredMeters * distance) / 100 +
      (perMinuteDrive * duration) / 60;

    console.log(`Initial calculation without multiplier: ${i}`);

    // --- Existing multiplier logic ---
    if (service.distanceMultipliers) {
      let ratioCost = 0;
      let newRatioCost = 0;
      let ratioDistance = 0;
      let endDistance = 0;
      for (const _multiplier of service.distanceMultipliers) {
        if (distance > _multiplier.distanceFrom) {
          endDistance =
            distance > _multiplier.distanceTo ? _multiplier.distanceTo : distance;
          ratioDistance = endDistance - _multiplier.distanceFrom;
          ratioCost = (ratioDistance / distance) * i;
          newRatioCost = ratioCost * _multiplier.multiply;
          i = i - ratioCost + newRatioCost;
          console.log(`After distance multiplier: ${i}`);
        }
      }
    }
    if (service.timeMultipliers) {
      for (const _multiplier of service.timeMultipliers) {
        const startMinutes =
          parseInt(_multiplier.startTime.split(':')[0]) * 60 +
          parseInt(_multiplier.startTime.split(':')[1]);
        const nowMinutes = eta.getHours() * 60 + eta.getMinutes();
        const endMinutes =
          parseInt(_multiplier.endTime.split(':')[0]) * 60 +
          parseInt(_multiplier.endTime.split(':')[1]);
        if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
          i *= _multiplier.multiply;
          multiplier *= _multiplier.multiply;
          console.log(`After time multiplier: ${i}`);
        }
      }
    }
    if (service.weekdayMultipliers) {
      for (const _multiplier of service.weekdayMultipliers) {
        if (_multiplier.weekday === weekdays[eta.getDay()]) {
          i *= _multiplier.multiply;
          multiplier *= _multiplier.multiply;
          console.log(`After weekday multiplier: ${i}`);
        }
      }
    }
    if (service.dateRangeMultipliers) {
      for (const _multiplier of service.dateRangeMultipliers) {
        const startDate = new Date(_multiplier.startDate);
        const endDate = new Date(_multiplier.endDate);
        if (eta >= startDate && eta <= endDate) {
          i *= _multiplier.multiply;
          multiplier *= _multiplier.multiply;
          console.log(`After date range multiplier: ${i}`);
        }
      }
    }
    // --- End of multiplier logic ---

    i *= fleetMultiplier;
    multiplier *= fleetMultiplier;
    console.log(`After fleet multiplier: ${i}`);

    // Add loaders cost
    i += loadersCost;
    console.log(`After adding loaders cost (${loadersCost}): ${i}`);

    // Apply minimum fee (vehicle-specific)
    if (i < minimumFee * multiplier) {
      i = minimumFee * multiplier;
      console.log(`After Minimum fee applied: ${i}`);
    }

    // Apply tourist multiplier (assuming general for now)
    if (isResident === false) {
      i *= service.touristMultiplier;
    }

    // Apply rounding factor (assuming general for now)
    if (service.roundingFactor != null) {
      i = Math.round(i / service.roundingFactor) * service.roundingFactor;
      console.log(`After Rounding factor applied: ${i}`);
    }

    return i;
  }

  getWithId(id: number): Promise<ServiceEntity | null> {
    return this.serviceRepo.findOneBy({ id });
  }
}

// IMPORTANT: Ensure the module that provides ServiceService (e.g., OrderModule)
// imports the SettingModule from '@ridy/common/setting/setting.module' (adjust path).