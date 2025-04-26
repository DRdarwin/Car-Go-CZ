// admin-api/src/app/payout/dto/create-payout-method.input.ts
import { Field, ID, InputType } from '@nestjs/graphql'; // Додано Field, ID
// TODO: Перевірити/розширити цей Enum
import { PayoutMethodType } from '@ridy/database/enums/payout-method-type.enum';

@InputType()
export class CreatePayoutMethodInput {
  @Field({ defaultValue: true }) // За замовчуванням активний
  enabled?: boolean;

  @Field()
  name!: string; // Назва методу

  @Field({ nullable: true })
  description?: string; // Опис

  @Field()
  currency!: string; // Валюта

  @Field(() => PayoutMethodType) // TODO: Перевірити/розширити Enum
  type!: PayoutMethodType; // Тип (Stripe, Bank, etc.)

  // Ключі API та інші налаштування (залежать від типу)
  @Field({ nullable: true })
  publicKey?: string;

  @Field({ nullable: true })
  privateKey?: string;

  @Field({ nullable: true })
  saltKey?: string;

  @Field({ nullable: true })
  merchantId?: string;

  @Field(() => ID, { nullable: true })
  mediaId?: number; // ID іконки
}