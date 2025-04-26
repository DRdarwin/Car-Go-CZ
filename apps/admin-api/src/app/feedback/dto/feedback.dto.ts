// admin-api/src/app/feedback/dto/feedback.dto.ts
import {
  FilterableField,
  FilterableUnPagedRelation,
  IDField,
  Relation, // Додано Relation
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FeedbackParameterDTO } from './feedback-parameter.dto'; // Ім'я файлу параметру не змінилось
import { OrderDTO } from '../../order/dto/order.dto'; // Додаємо зв'язок із замовленням
import { DriverDTO } from '../../driver/dto/driver.dto'; // Додаємо зв'язок із водієм

@ObjectType('Feedback')
// Зв'язок з параметрами залишається
@FilterableUnPagedRelation('parameters', () => FeedbackParameterDTO, {
  enableAggregate: true,
})
@Relation('order', () => OrderDTO, { relationName: 'request' }) // Зв'язок з конкретним замовленням
@Relation('driver', () => DriverDTO) // Зв'язок з водієм, якого оцінюють
export class FeedbackDTO {
  @IDField(() => ID)
  id!: number;

  @Field(() => Int)
  score!: number; // Загальна оцінка (наприклад, 1-5 зірок)

  @Field() // Додано Field
  reviewTimestamp: Date; // Час створення відгуку

  description?: string; // Текстовий коментар

  @FilterableField(() => ID)
  driverId: number; // ID водія, якого оцінюють

  @FilterableField(() => ID)
  requestId: number; // ID замовлення (request), до якого відноситься відгук
}