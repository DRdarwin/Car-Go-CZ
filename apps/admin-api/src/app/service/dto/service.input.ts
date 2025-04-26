// apps/admin-api/src/app/service/dto/service.input.ts
import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator'; // NEW: Import validators
import { Point, TimeMultiplier, DistanceMultiplier, VehicleType } from '@ridy/database'; // Assuming VehicleType is exported from database index
import { ServicePaymentMethod } from '@ridy/database/enums/service-payment-method.enum';
import { DateRangeMultiplier } from 'libs/database/src/lib/interfaces/date-range-multiplier.dto';
import { WeekdayMultiplier } from 'libs/database/src/lib/interfaces/weekday-multiplier.dto';
import { GraphQLJSONObject } from 'graphql-type-json'; // NEW: Import GraphQLJSONObject
import { Type } from 'class-transformer';

// NEW: Define Input Type for VehicleTariff to enable validation (optional but recommended)
@InputType('VehicleTariffInput') // InputType name must be unique
class VehicleTariffInput {
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  baseFare!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  perHundredMeters!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  perMinuteDrive!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  minimumFee!: number;

  // Add other tariff fields if they become vehicle-specific
}

// NEW: Define Input Type for the map using VehicleType keys
// We might need a custom scalar or a workaround if mapping enum keys directly is complex in GraphQL input.
// Using GraphQLJSONObject is simpler for now. Validation might need a custom validator or happen in the service.
// @InputType()
// class VehicleTariffsInput {
//     @Field(() => VehicleTariffInput, { nullable: true })
//     [VehicleType.Pickup]?: VehicleTariffInput; // This direct enum key usage might not work directly in GraphQL schema

//     @Field(() => VehicleTariffInput, { nullable: true })
//     [VehicleType.Van]?: VehicleTariffInput;

//     // ... other vehicle types
// }


@InputType('AdminServiceInput') // Renamed InputType to avoid conflicts
export class ServiceInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @FilterableField(() => ID)
  @IsInt()
  categoryId!: number;

  // REMOVED: Old tariff fields and potentially misplaced cargo fields
  // @Field(() => Float, { ... }) baseFare!: number;
  // @Field(() => Float, { ... }) perKilometer!: number; // Assuming perHundredMeters is the standard now
  // @Field(() => Float, { ... }) perHourDrive!: number;
  // @Field(() => Float, { ... }) minimumFee!: number;
  // @Field(() => Float, { ... }) maxPayloadKg?: number; // Move to VehicleEntity or VehicleTariff?
  // @Field(() => Float, { ... }) maxVolumeM3?: number; // Move to VehicleEntity or VehicleTariff?
  // @Field(() => Float, { ... }) perKg?: number; // Move to VehicleTariff?
  // @Field(() => Float, { ... }) perM3?: number; // Move to VehicleTariff?
  // @Field(() => Float, { ... }) perFloorNoLiftFee?: number; // Likely a ServiceOption

  // NEW: Field for vehicle-specific tariffs
  @Field(() => GraphQLJSONObject, { nullable: true, description: 'Tariffs per vehicle type (e.g., {"van": {"baseFare": 10, ...}})' })
  @IsOptional()
  @IsObject() // Basic object validation
  // TODO: Add custom validation here or in the service to ensure structure matches VehicleTariffs interface
  vehicleTariffs?: Record<string, any>; // Using Record<string, any> for flexibility with GraphQLJSONObject

  @Field(() => Float, { description: 'Вартість за годину (очікування/простій/завантаження)' })
  @IsNumber()
  @Min(0)
  perHourWait!: number; // Kept from original input

  @Field(() => Float, { nullable: true, description: 'Коефіцієнт округлення вартості' })
  @IsOptional()
  @IsNumber()
  roundingFactor?: number;

  @Field(() => Int, { description: 'Радіус пошуку водіїв (метри)' })
  @IsInt()
  @Min(0)
  searchRadius!: number;

  @Field(() => ServicePaymentMethod, { description: 'Доступні методи оплати' })
  @IsEnum(ServicePaymentMethod)
  paymentMethod!: ServicePaymentMethod;

  @Field(() => Float, { description: 'Повна вартість скасування для клієнта' })
  @IsNumber()
  @Min(0)
  cancellationTotalFee!: number;

  @Field(() => Float, { description: 'Частка водія від вартості скасування (%)' }) // Assuming this is percent, not flat value
  @IsNumber()
  @Min(0)
  cancellationDriverShare!: number; // This was percent in input description

  @Field(() => Float, { description: 'Комісія платформи (%)' })
  @IsNumber()
  @Min(0)
  providerSharePercent!: number;

  @Field(() => Float, { description: 'Фіксована комісія платформи' })
  @IsNumber()
  @Min(0)
  providerShareFlat!: number;

  @Field(() => Int, { nullable: true, description: 'Максимальна відстань поїздки (км)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  maximumDestinationDistance?: number;

  // Keep multipliers as they seem general service properties
  @Field(() => [TimeMultiplier], { nullable: true, description: 'Множники тарифу за часом доби' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeMultiplier)
  timeMultipliers?: TimeMultiplier[];

  @Field(() => [DistanceMultiplier], { nullable: true, description: 'Множники тарифу за відстанню' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DistanceMultiplier)
  distanceMultipliers?: DistanceMultiplier[];

  @Field(() => [WeekdayMultiplier], { nullable: true, description: 'Множники тарифу за днями тижня' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekdayMultiplier)
  weekdayMultipliers?: WeekdayMultiplier[];

  @Field(() => [DateRangeMultiplier], { nullable: true, description: 'Множники тарифу за діапазоном дат' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DateRangeMultiplier)
  dateRangeMultipliers?: DateRangeMultiplier[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsInt()
  mediaId?: number;
}