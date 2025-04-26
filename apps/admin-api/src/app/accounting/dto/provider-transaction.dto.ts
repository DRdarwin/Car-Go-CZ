// admin-api/src/app/accounting/dto/provider-transaction.dto.ts
import { FilterableField, IDField, Relation } from '@ptc-org/nestjs-query-graphql'; // Додано Relation
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'; // Додано Field, Float
// TODO: Перевірити/розширити ці Enum-и для вантажних перевезень
import { ProviderDeductTransactionType } from '@ridy/database/enums/provider-deduct-transaction-type.enum';
import { ProviderRechargeTransactionType } from '@ridy/database/enums/provider-recharge-transaction-type.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';
import { OperatorDTO } from '../../operator/dto/operator.dto'; // Для зв'язку з оператором
import { OrderDTO } from '../../order/dto/order.dto'; // Для зв'язку з замовленням

@ObjectType('ProviderTransaction')
@Relation('operator', () => OperatorDTO, { nullable: true, description: 'Оператор, що створив транзакцію (якщо створено вручну)' })
@Relation('order', () => OrderDTO, { nullable: true, relationName: 'request', description: 'Замовлення, до якого відноситься транзакція' })
export class ProviderTransactionDTO {
  @IDField(() => ID)
  id: number;

  @Field() // Додано Field
  createdAt!: Date; // Час створення транзакції

  @Field(() => TransactionAction)
  action: TransactionAction; // Recharge (дохід платформи), Deduct (витрата платформи)

  // Типи списання/поповнення балансу ПЛАТФОРМИ
  // Потрібно переконатися, що ці типи покривають всі сценарії вантажного таксі:
  // - Комісія за вантажне перевезення
  // - Комісія за послуги вантажників (якщо йде через платформу)
  // - Плата за підписку автопарків/водіїв (якщо є)
  // - Штрафи / Компенсації
  @Field(() => ProviderDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
  deductType?: ProviderDeductTransactionType;

  @Field(() => ProviderRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
  rechargeType?: ProviderRechargeTransactionType;

  @Field(() => Float) // Додано Float
  amount: number; // Сума транзакції

  currency: string; // Валюта

  refrenceNumber?: string; // Зовнішній ID (напр., ID платежу)
  description?: string; // Опис для адмін панелі

  @FilterableField(() => ID, { nullable: true })
  operatorId?: number; // ID оператора

  @FilterableField(() => ID, { nullable: true })
  requestId?: number; // ID замовлення
}