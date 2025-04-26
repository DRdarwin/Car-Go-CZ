// admin-api/src/app/fleet/dto/fleet-transaction.dto.ts
import {
  FilterableField,
  IDField,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'; // Додано Field, Float
// TODO: Переглянути ці Enum-и на релевантність для вантажних автопарків
import { ProviderDeductTransactionType } from '@ridy/database/enums/provider-deduct-transaction-type.enum';
import { ProviderRechargeTransactionType } from '@ridy/database/enums/provider-recharge-transaction-type.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';
import { OperatorDTO } from '../../operator/dto/operator.dto';

@ObjectType('FleetTransaction')
@Relation('operator', () => OperatorDTO, { nullable: true })
export class FleetTransactionDTO {
  @IDField(() => ID)
  id: number;

  @Field() // Дата/час транзакції
  transactionTimestamp!: Date;

  action: TransactionAction; // Recharge, Deduct

  // Типи транзакцій (можуть бути ті ж самі, що й для платформи)
  deductType?: ProviderDeductTransactionType; // TODO: Переглянути Enum
  rechargeType?: ProviderRechargeTransactionType; // TODO: Переглянути Enum

  @Field(() => Float)
  amount: number;

  currency: string;
  refrenceNumber?: string;
  description?: string;

  @FilterableField(() => ID, { nullable: true })
  operatorId?: number; // ID оператора, що створив транзакцію

  @FilterableField(() => ID, { nullable: true })
  requestId?: number; // ID замовлення, якщо транзакція пов'язана з ним

  @FilterableField(() => ID)
  fleetId: number; // ID автопарку
}