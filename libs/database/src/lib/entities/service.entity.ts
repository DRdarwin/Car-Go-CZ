// libs/database/src/lib/entities/service.entity.ts
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DistanceMultiplier } from '../interfaces/distance-multiplier.dto';
import { TimeMultiplier } from '../interfaces/time-multiplier.dto';
import { DistanceMultiplierTransformer } from '../transformers/distance-multiplier.transformer';
import { TimeMultiplierTransformer } from '../transformers/time-multiplier.transformer';
import { CouponEntity } from './coupon.entity';
import { DriverEntity } from './driver.entity';
import { ServiceDistanceFeeMode } from './enums/service-distance-fee-mode.enum';
import { ServicePaymentMethod } from './enums/service-payment-method.enum';
import { MediaEntity } from './media.entity';
import { RequestEntity } from './request.entity';
import { RegionEntity } from './region.entity';
import { ServiceCategoryEntity } from './service-category.entity';
import { ServiceOptionEntity } from './service-option.entity';
import { ZonePriceEntity } from './zone-price.entity';
import { WeekdayMultiplierTransformer } from '../transformers/weekday-multiplier.transformer';
import { WeekdayMultiplier } from '../interfaces/weekday-multiplier.dto';
import { DateRangeMultiplierTransformer } from '../transformers/date-range-multiplier.transformer';
import { DateRangeMultiplier } from '../interfaces/date-range-multiplier.dto';
import { VehicleTariffs } from '../interfaces/vehicle-type.enum'; // NEW: Import tariff interface

@Entity('service')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ServiceCategoryEntity, (category) => category.services, {
    onDelete: 'CASCADE',
  })
  category!: ServiceCategoryEntity;

  @Column()
  categoryId!: number;

  @Column({ name: 'title' })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column('smallint', { nullable: true })
  personCapacity?: number; // REMOVED: Typically not applicable for cargo? Or maybe keep for specific types? Keeping for now.

  // REMOVED: Old single tariff fields
  // @Column('float', { ... })
  // baseFare!: number;
  // @Column('float', { ... })
  // perHundredMeters!: number;
  // @Column('float', { ... })
  // perMinuteDrive!: number;
  // @Column('float', { ... })
  // minimumFee!: number;

  // NEW: Field to store tariffs per vehicle type
  @Column('jsonb', { nullable: true })
  vehicleTariffs?: VehicleTariffs; // Stores { "pickup": { "baseFare": 10, ... }, "van": { ... } }

  @Column('float', {
    default: '0.00',
    precision: 12,
    scale: 2,
  })
  perMinuteWait!: number; // Keep wait time as it might be general

  @Column('int', {
    default: 10000,
  })
  searchRadius!: number; // TODO: Might need adjustment per vehicle type later

  @Column({
    type: 'enum',
    enum: ServicePaymentMethod,
    default: ServicePaymentMethod.CashCredit,
  })
  paymentMethod!: ServicePaymentMethod;

  @Column('enum', {
    enum: ServiceDistanceFeeMode,
    default: ServiceDistanceFeeMode.PickupToDestination,
  })
  distanceFeeMode!: ServiceDistanceFeeMode;

  @Column('time', {
    default: '00:00',
  })
  availableTimeFrom!: string;

  @Column('time', {
    default: '23:59',
  })
  availableTimeTo!: string;

  @Column('int', { default: 0, name: 'maxDestinationDistance' })
  maximumDestinationDistance!: number; // TODO: Might need adjustment per vehicle type later

  @Column('tinyint', { default: 0 })
  prepayPercent!: number; // TODO: Might need adjustment per vehicle type later

  @Column({ default: false })
  twoWayAvailable!: boolean;

  @Column('float', {
    default: '0.00',
    precision: 10,
    scale: 2,
  })
  cancellationTotalFee!: number; // TODO: Might need adjustment per vehicle type later

  @Column('float', {
    default: '0.00',
    precision: 10,
    scale: 2,
  })
  cancellationDriverShare!: number; // TODO: Might need adjustment per vehicle type later

  @Column('tinyint', { default: 0 })
  providerSharePercent!: number; // TODO: Might need adjustment per vehicle type later

  @Column('float', {
    default: '0.00',
    precision: 10,
    scale: 2,
  })
  providerShareFlat!: number; // TODO: Might need adjustment per vehicle type later

  @Column('float', {
    nullable: true,
    precision: 10,
    scale: 2,
  })
  roundingFactor?: number;

  @OneToOne(() => MediaEntity, (media) => media.service)
  @JoinColumn()
  media!: MediaEntity; // TODO: Change icon based on vehicleType? Frontend logic.

  @Column()
  mediaId!: number;

  @Column('simple-array', {
    nullable: true,
    transformer: new TimeMultiplierTransformer(),
  })
  timeMultipliers!: TimeMultiplier[]; // TODO: Might need adjustment per vehicle type later

  @Column('simple-array', {
    nullable: true,
    transformer: new DistanceMultiplierTransformer(),
  })
  distanceMultipliers!: DistanceMultiplier[]; // TODO: Might need adjustment per vehicle type later

  @Column('simple-array', {
    nullable: true,
    transformer: new DateRangeMultiplierTransformer(),
  })
  dateRangeMultipliers!: DateRangeMultiplier[]; // TODO: Might need adjustment per vehicle type later

  @Column('simple-array', {
    nullable: true,
    transformer: new WeekdayMultiplierTransformer(),
  })
  weekdayMultipliers!: WeekdayMultiplier[]; // TODO: Might need adjustment per vehicle type later

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column('float', { default: 1.0 })
  touristMultiplier!: number; // TODO: Might need adjustment per vehicle type later

  @ManyToMany(() => DriverEntity, (driver) => driver.enabledServices)
  drivers!: DriverEntity[];

  @ManyToMany(() => CouponEntity, (coupon) => coupon.allowedServices)
  allowedCoupons!: CouponEntity[];

  @ManyToMany(() => RegionEntity, (region) => region.services)
  @JoinTable()
  regions!: RegionEntity[];

  @OneToMany(() => RequestEntity, (order) => order.service)
  requests!: RequestEntity[];

  @ManyToMany(
    () => ServiceOptionEntity,
    (serviceOption) => serviceOption.services,
  )
  @JoinTable()
  options!: ServiceOptionEntity[];

  @ManyToMany(() => ZonePriceEntity, (zonePrice) => zonePrice.fleets) // TODO: Check relation name 'fleets'
  zonePrices!: ZonePriceEntity;
}