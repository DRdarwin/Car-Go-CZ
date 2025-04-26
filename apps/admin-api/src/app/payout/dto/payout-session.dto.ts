// admin-api/src/app/payout/dto/payout-session.dto.ts
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'; // Додано Field, Float
import {
  Authorize,
  FilterableField, // Додано FilterableField
  IDField,
  OffsetConnection,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { PayoutSessionStatus } from '@ridy/database/enums/payout-session-status.enum';
import { DriverTransactionDTO } from '../../driver/dto/driver-transaction.dto';
import { PayoutMethodDTO } from './payout-method.dto';
import { PayoutAuthorizer } from '../payout.authorizer';
import { OperatorDTO } from '../../operator/dto/operator.dto'; // Для зв'язку з оператором

@ObjectType('PayoutSession')
// Зв'язок з транзакціями водіїв, що входять до цієї сесії
@OffsetConnection('driverTransactions', () => DriverTransactionDTO, {
  enableAggregate: true, // Дозволяє агрегацію (наприклад, суму)
})
// Зв'язок з методами виплат, що використовуються в цій сесії
@UnPagedRelation('payoutMethods', () => PayoutMethodDTO)
@Relation('operator', () => OperatorDTO, { nullable: true, description: 'Оператор, що створив сесію' }) // Додано зв'язок з оператором
@Authorize(PayoutAuthorizer) // Застосовуємо авторизатор
export class PayoutSessionDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField({ description: 'Дата створення сесії' }) // Додано фільтрацію
  createdAt!: Date;

  @Field({ nullable: true, description: 'Дата обробки/завершення сесії' })
  processedAt?: Date;

  description?: string; // Опис сесії (наприклад, "Виплати за березень")

  @FilterableField(() => PayoutSessionStatus, { description: 'Статус сесії виплат' }) // Додано фільтрацію
  status!: PayoutSessionStatus; // Pending, Processing, Paid, Failed

  @Field(() => Float, { description: 'Загальна сума виплат у цій сесії' })
  totalAmount!: number;

  currency!: string; // Валюта сесії

  // Додаємо ID оператора для можливості фільтрації/відображення
  @FilterableField(() => ID, { nullable: true })
  createdByOperatorId?: number;
}