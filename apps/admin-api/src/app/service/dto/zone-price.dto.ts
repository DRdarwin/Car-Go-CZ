// admin-api/src/app/service/dto/zone-price.dto.ts
import {
  Authorize,
  FilterableField, // Додано FilterableField
  IDField,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'; // Додано Float, registerEnumType, Field
import { Point, TimeMultiplier } from '@ridy/database';
import { FleetDTO } from '../../fleet/dto/fleet.dto';
import { ServiceAuthorizer } from './service.authorizer';
import { ServiceDTO } from './service.dto';

// Тип вартості для зони: фіксована, заміна тарифу за км, або відсоткова надбавка/знижка
export enum ZonePriceCostType {
  FIXED = 'Fixed',
  PER_KM_OVERRIDE = 'PerKmOverride',
  SURCHARGE_PERCENT = 'SurchargePercent',
  DISCOUNT_PERCENT = 'DiscountPercent',
}
registerEnumType(ZonePriceCostType, { name: 'ZonePriceCostType' });

@ObjectType('ZonePrice')
@UnPagedRelation('fleets', () => FleetDTO, {
  update: { enabled: true },
})
@UnPagedRelation('services', () => ServiceDTO, {
  update: { enabled: true },
})
@Authorize(ServiceAuthorizer)
export class ZonePriceDTO {
  @IDField(() => ID)
  id: number;

  @FilterableField() // Дозволяємо фільтрацію
  name!: string; // Назва правила (наприклад, "Центр -> Передмістя (пік)")

  @Field(() => [[Point]], { description: 'Полігони зони ВІДПРАВЛЕННЯ' })
  from!: Point[][];

  @Field(() => [[Point]], { description: 'Полігони зони ПРИЗНАЧЕННЯ' })
  to!: Point[][];

  @Field(() => Float, { description: 'Значення вартості (залежить від costType)' })
  cost: number; // Значення: фіксована сума, новий тариф за км, або відсоток

  @Field(() => ZonePriceCostType, { description: 'Тип застосування вартості' })
  costType: ZonePriceCostType; // Як інтерпретувати поле cost

  @Field(() => [TimeMultiplier], { description: 'Множники за часом доби для цього правила зони' })
  timeMultipliers!: TimeMultiplier[];
}