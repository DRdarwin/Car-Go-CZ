// libs/database/src/lib/interfaces/vehicle-tariff.interface.ts
import { VehicleType } from '../entities/enums/vehicle-type.enum';

export interface VehicleTariff {
    baseFare: number;
    perHundredMeters: number;
    perMinuteDrive: number;
    minimumFee: number;
}

export type VehicleTariffs = {
    [key in VehicleType]?: VehicleTariff;
};