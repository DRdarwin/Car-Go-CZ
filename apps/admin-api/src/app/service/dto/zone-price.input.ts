// admin-api/src/app/service/dto/zone-price.input.ts
import { Field, Float, InputType } from '@nestjs/graphql'; // Додано Field, Float
import { Point, TimeMultiplier } from '@ridy/database';
import { ZonePriceCostType } from './zone-price.dto'; // Імпортуємо Enum

@InputType()
export class ZonePriceInput {
  @Field()
  name!: string;

  @Field(() => [[Point]], { description: 'Полігони зони ВІДПРАВЛЕННЯ' })
  from!: Point[][];

  @Field(() => [[Point]], { description: 'Полігони зони ПРИЗНАЧЕННЯ' })
  to!: Point[][];

  @Field(() => Float, { description: 'Значення вартості (залежить від costType)' })
  cost: number;

  @Field(() => ZonePriceCostType, { description: 'Тип застосування вартості' })
  costType: ZonePriceCostType; // Додано тип вартості

  @Field(() => [TimeMultiplier], { description: 'Множники за часом доби для цього правила зони' })
  timeMultipliers!: TimeMultiplier[];
}