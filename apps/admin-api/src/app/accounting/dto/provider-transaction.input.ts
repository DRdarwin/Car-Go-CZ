// admin-api/src/app/accounting/dto/provider-transaction.input.ts
import { Field, Float, ID, InputType } from '@nestjs/graphql'; // Додано Float
import { FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';
// TODO: Перевірити/розширити ці Enum-и
import { ProviderDeductTransactionType } from '@ridy/database/enums/provider-deduct-transaction-type.enum';
import { ProviderRechargeTransactionType } from '@ridy/database/enums/provider-recharge-transaction-type.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';

@InputType()
export class ProviderTransactionInput {
  // createdAt зазвичай встановлюється автоматично при створенні
  // createdAt!: Date;

  @Field(() => TransactionAction)
  action: TransactionAction; // Recharge / Deduct

  @Field(() => ProviderDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
  deductType?: ProviderDeductTransactionType;

  @Field(() => ProviderRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
  rechargeType?: ProviderRechargeTransactionType;

  @Field(() => Float) // Додано Float
  amount: number;

  currency: string;
  refrenceNumber?: string;
  description?: string;

  // Ці поля зазвичай заповнюються сервісом, а не передаються напряму в Input
  // @FilterableField(() => ID)
  // operatorId?: number;
  // @FilterableField(() => ID)
  // requestId?: number;
}