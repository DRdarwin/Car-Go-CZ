// admin-api/src/app/service/dto/service-option.input.ts
import { Field, Float, InputType } from '@nestjs/graphql'; // Додано Float
import { CargoServiceOptionIcon, CargoServiceOptionType } from './service-option.dto'; // Імпортуємо нові Enum

@InputType()
export class ServiceOptionInput {
  @Field()
  name: string;

  @Field(() => CargoServiceOptionType)
  type: CargoServiceOptionType;

  @Field(() => Float, { nullable: true })
  additionalFee?: number;

  @Field(() => CargoServiceOptionIcon)
  icon: CargoServiceOptionIcon;
}