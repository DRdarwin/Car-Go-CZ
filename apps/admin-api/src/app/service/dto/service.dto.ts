// admin-api/src/app/service/dto/service.dto.ts
import {
  Authorize,
  FilterableField,
  IDField,
  PagingStrategies,
  Relation,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'; // Додано Float
import { DistanceMultiplier } from '@ridy/database';
import { TimeMultiplier } from '@ridy/database';
import { ServicePaymentMethod } from '@ridy/database/enums/service-payment-method.enum';
import { DateRangeMultiplier } from 'libs/database/src/lib/interfaces/date-range-multiplier.dto';
import { WeekdayMultiplier } from 'libs/database/src/lib/interfaces/weekday-multiplier.dto';
import { RegionDTO } from '../../region/dto/region.dto';
import { MediaDTO } from '../../upload/media.dto';
import { ServiceOptionDTO } from './service-option.dto';
import { ServiceAuthorizer } from './service.authorizer';

@ObjectType('Service')
@UnPagedRelation('regions', () => RegionDTO, {
  pagingStrategy: PagingStrategies.NONE,
  update: { enabled: true },
})
@Relation('media', () => MediaDTO, { nullable: true }) // Медіа для іконки послуги
@UnPagedRelation('options', () => ServiceOptionDTO, {
  update: { enabled: true }, // Дозволяємо оновлювати зв'язані опції
})
@Authorize(ServiceAuthorizer) // Застосовуємо авторизатор
export class ServiceDTO {
  @IDField(() => ID)
  id!: number;

  name!: string;
  description?: string;

  @FilterableField(() => ID)
  categoryId: number; // ID категорії послуги (наприклад, "Перевезення до 1.5т", "Рефрижератор")

  // --- Характеристики Вантажопідйомності ---
  @Field(() => Float, { nullable: true, description: 'Максимальна вантажопідйомність (кг)' })
  maxPayloadKg?: number;

  @Field(() => Float, { nullable: true, description: 'Максимальний об\'єм вантажу (м³)' })
  maxVolumeM3?: number;

  // --- Ціноутворення ---
  @Field(() => Float, { description: 'Базова ставка за подачу / початок поїздки' })
  baseFare!: number;

  @Field(() => Float, { nullable: true, description: 'Коефіцієнт округлення вартості' })
  roundingFactor?: number;

  @Field(() => Float, { description: 'Вартість за кілометр' })
  perKilometer!: number; // Замість perHundredMeters

  @Field(() => Float, { description: 'Вартість за годину (в дорозі)' })
  perHourDrive!: number; // Замість perMinuteDrive

  @Field(() => Float, { description: 'Вартість за годину (очікування/простій/завантаження)' })
  perHourWait!: number; // Замість perMinuteWait

  // Можливо, додати специфічні для вантажу тарифи:
  @Field(() => Float, { nullable: true, description: 'Додаткова вартість за кг (якщо застосовується)' })
  perKg?: number;

  @Field(() => Float, { nullable: true, description: 'Додаткова вартість за м³ (якщо застосовується)' })
  perM3?: number;

  @Field(() => Float, { nullable: true, description: 'Вартість за підйом на поверх (без ліфта)' })
  perFloorNoLiftFee?: number;

  // --- Загальні Налаштування ---
  @Field(() => Float, { description: 'Мінімальна вартість поїздки' })
  minimumFee!: number;

  @Field(() => Int, { description: 'Радіус пошуку водіїв (метри)' })
  searchRadius!: number;

  @Field(() => ServicePaymentMethod, { description: 'Доступні методи оплати' })
  paymentMethod!: ServicePaymentMethod;

  // --- Скасування ---
  @Field(() => Float, { description: 'Повна вартість скасування для клієнта' })
  cancellationTotalFee!: number;

  @Field(() => Float, { description: 'Частка водія від вартості скасування (%)' })
  cancellationDriverShare!: number; // Зазвичай %

  // --- Комісія Платформи ---
  @Field(() => Float, { description: 'Комісія платформи (%)' })
  providerSharePercent!: number; // Змінено Int на Float

  @Field(() => Float, { description: 'Фіксована комісія платформи' })
  providerShareFlat!: number;

  // --- Обмеження ---
  @Field(() => Int, { nullable: true, description: 'Максимальна відстань поїздки (км)' })
  maximumDestinationDistance?: number; // Змінено на км

  // --- Множники Тарифів ---
  @Field(() => [TimeMultiplier], { description: 'Множники тарифу за часом доби' })
  timeMultipliers!: TimeMultiplier[];

  @Field(() => [DistanceMultiplier], { nullable: true, description: 'Множники тарифу за відстанню' })
  distanceMultipliers?: DistanceMultiplier[]; // Зроблено nullable, якщо не завжди потрібні

  @Field(() => [WeekdayMultiplier], { nullable: true, description: 'Множники тарифу за днями тижня' })
  weekdayMultipliers?: WeekdayMultiplier[];

  @Field(() => [DateRangeMultiplier], { nullable: true, description: 'Множники тарифу за діапазоном дат' })
  dateRangeMultipliers?: DateRangeMultiplier[];

  @Field(() => ID, { nullable: true })
  mediaId?: number; // ID іконки послуги
}