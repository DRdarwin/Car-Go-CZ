// admin-api/src/app/feedback/dto/feedback-parameter.input.ts
import { InputType, Field } from '@nestjs/graphql'; // Додано Field

@InputType()
export class FeedbackParameterInput {
  @Field()
  title: string; // Назва параметру (наприклад, "Стан вантажу при доставці")

  @Field()
  isGood: boolean; // Чи є параметр позитивним
}