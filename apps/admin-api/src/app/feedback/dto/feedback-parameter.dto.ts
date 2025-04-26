// admin-api/src/app/feedback/dto/feedback-parameter.dto.ts
import {
  Authorize,
  FilterableField,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql'; // Додано Field
import { FeedbackParameterAuthorizer } from './feedback-parameter.authorizer';

@ObjectType('FeedbackParameter')
@Authorize(FeedbackParameterAuthorizer) // Застосовуємо авторизатор
export class FeedbackParameterDTO {
  @IDField(() => ID)
  id: number;

  @FilterableField()
  // Приклади назв для вантажного таксі:
  // "Стан вантажу при доставці", "Швидкість завантаження/розвантаження",
  // "Дотримання термінів", "Професіоналізм водія (поводження з вантажем)",
  // "Комунікація з водієм", "Відповідність авто замовленню"
  title: string; // Назва параметру

  @FilterableField()
  // Чи є параметр позитивним (true) чи негативним (false)
  // Наприклад: "Стан вантажу..." (isGood=true), "Пошкодження вантажу" (isGood=false)
  isGood: boolean;
}