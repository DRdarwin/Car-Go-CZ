// admin-api/src/app/order/dto/order.dto.ts
import {
  FilterableField,
  FilterableRelation, // Додано для зв'язку з опціями
  IDField,
  Relation,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'; // Додано Float
import { Point } from '@ridy/database';
import { OrderStatus } from '@ridy/database/enums/order-status.enum';

import { ProviderTransactionDTO } from '../../accounting/dto/provider-transaction.dto';
import { ComplaintDTO } from '../../complaint/dto/complaint.dto';
import { CouponDTO } from '../../coupon/dto/coupon.dto';
import { DriverTransactionDTO } from '../../driver/dto/driver-transaction.dto';
import { DriverDTO } from '../../driver/dto/driver.dto';
import { FleetTransactionDTO } from '../../fleet/dto/fleet-transaction.dto';
import { RiderTransactionDTO } from '../../rider/dto/rider-transaction.dto';
import { RiderDTO } from '../../rider/dto/rider.dto';
import { ServiceDTO } from '../../service/dto/service.dto';
import { OrderMessageDTO } from './order-message.dto';
import { RequestActivityDTO } from './request-activity.dto';
import { ServiceOptionDTO } from '../../service/dto/service-option.dto'; // Імпортуємо опції

// Опціонально: Створюємо DTO для зв'язку з обраними опціями, якщо не хочемо використовувати JSON
// @ObjectType('SelectedOrderOption')
// @Relation('option', () => ServiceOptionDTO)
// export class SelectedOrderOptionDTO {
//   @IDField(() => ID)
//   id: number; // ID запису зв'язку
//   @Field(() => Int, { nullable: true })
//   quantity?: number; // Кількість (наприклад, вантажників)
//   optionId: number;
//   orderId: number;
// }

@ObjectType('Order')
@Relation('driver', () => DriverDTO, { nullable: true })
@Relation('rider', () => RiderDTO, { nullable: true }) // Замовник
@Relation('service', () => ServiceDTO, { nullable: true })
@Relation('coupon', () => CouponDTO, { nullable: true })
@UnPagedRelation('complaints', () => ComplaintDTO)
@UnPagedRelation('conversation', () => OrderMessageDTO, {
  relationName: 'conversation',
})
@UnPagedRelation('riderTransactions', () => RiderTransactionDTO)
@UnPagedRelation('driverTransactions', () => DriverTransactionDTO)
@UnPagedRelation('fleetTransactions', () => FleetTransactionDTO)
@UnPagedRelation('providerTransactions', () => ProviderTransactionDTO)
@UnPagedRelation('activities', () => RequestActivityDTO)
// @UnPagedRelation('selectedOptions', () => SelectedOrderOptionDTO) // Якщо використовуємо окреме DTO
export class OrderDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField()
  createdOn!: Date;

  startTimestamp?: Date; // Час початку виконання (прибуття до точки А)
  finishTimestamp?: Date; // Час завершення (в точці Б)

  @FilterableField(() => OrderStatus)
  status: OrderStatus;

  // --- Дані Маршруту та Часу ---
  @Field(() => Int, { description: 'Розрахункова відстань (метри)' })
  distanceBest: number;

  @Field(() => Int, { description: 'Розрахунковий час у дорозі (секунди)' })
  durationBest: number;

  // --- Вартість ---
  @Field(() => Float, { description: 'Початкова розрахункова вартість' })
  costBest: number;

  @Field(() => Float, { description: 'Фінальна вартість після купонів/знижок' })
  costAfterCoupon: number;

  currency: string;

  // --- Деталі Вантажу та Роботи ---
  @Field({ nullable: true, description: 'Опис вантажу' })
  cargoDescription?: string;

  @Field(() => Float, { nullable: true, description: 'Вага вантажу (кг)' })
  cargoWeightKg?: number;

  @Field(() => Float, { nullable: true, description: 'Об\'єм вантажу (м³)' })
  cargoVolumeM3?: number;

  @Field(() => Int, { nullable: true, description: 'Поверх в точці завантаження (для розрахунку підйому)' })
  pickupFloors?: number;

  @Field(() => Int, { nullable: true, description: 'Поверх в точці розвантаження (для розрахунку підйому)' })
  dropoffFloors?: number;

  @Field(() => Int, { nullable: true, description: 'Фактичний час роботи в точці завантаження (хвилини)' })
  pickupWorkTimeMinutes?: number;

  @Field(() => Int, { nullable: true, description: 'Фактичний час роботи в точці розвантаження (хвилини)' })
  dropoffWorkTimeMinutes?: number;

  // --- Опції ---
  // Простий варіант: зберігати обрані опції та їх кількість як JSON рядок
  @Field({ nullable: true, description: 'Обрані опції та їх параметри (JSON: [{optionId: 1, quantity: 2}])' })
  selectedOptionsJson?: string;

  // Або використовувати зв'язану сутність, якщо створено SelectedOrderOptionDTO
  // selectedOptions: SelectedOrderOptionDTO[];

  // --- Інше ---
  addresses: string[]; // Адреси точок маршруту
  points: Point[]; // Координати точок маршруту

  expectedTimestamp?: Date; // Очікуваний час подачі (для попередніх замовлень)

  @FilterableField(() => ID)
  riderId: number; // ID Замовника

  @FilterableField(() => ID, { nullable: true })
  driverId?: number;

  // Поле waitMinutes з пасажирського таксі; можливо, варто видалити або переосмислити
  // waitMinutes!: number;

  // Поле destinationArrivedTo з пасажирського таксі; ймовірно, не потрібне
  // @Field(() => Int)
  // destinationArrivedTo!: number;
}