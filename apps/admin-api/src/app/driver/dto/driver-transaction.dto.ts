// admin-api/src/app/driver/dto/driver-transaction.dto.ts
import {
  FilterableField,
  FilterableRelation, // Додано для зв'язку з оператором/водієм
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'; // Додано Float
// TODO: Перевірити/розширити ці Enum-и для вантажних перевезень
import { DriverDeductTransactionType, DriverRechargeTransactionType, TransactionAction, TransactionStatus } from '@ridy/database';

import { OperatorDTO } from '../../operator/dto/operator.dto';
import { PayoutAccountDTO } from '../../payout/dto/payout-account.dto'; // Додано для зв'язку з рахунком виплати
import { PayoutMethodDTO } from '../../payout/dto/payout-method.dto'; // Додано для зв'язку з методом виплати
import { DriverDTO } from './driver.dto';

@ObjectType('DriverTransaction')
@Relation('operator', () => OperatorDTO, { nullable: true, description: 'Оператор, що створив транзакцію (якщо вручну)' })
@Relation('driver', () => DriverDTO, { nullable: true }) // Зв'язок з водієм
@Relation('payoutAccount', () => PayoutAccountDTO, { nullable: true, description: 'Рахунок, на який/з якого йде виплата/списання' })
@Relation('payoutMethod', () => PayoutMethodDTO, { nullable: true, description: 'Метод виплати/списання' }) // Додано зв'язок з методом
export class DriverTransactionDTO {
  @FilterableField(() => ID) // Зроблено ID фільтрованим
  id!: number;

  @FilterableField()
  createdAt: Date;

  @Field(() => TransactionAction) // Додано декоратор Field
  action: TransactionAction; // Recharge (поповнення водія), Deduct (списання з водія)

  @FilterableField(() => TransactionStatus) // Зроблено статус фільтрованим
  status: TransactionStatus; // Processing, Done, Failed, Canceled etc.

  // Типи списання/поповнення балансу ВОДІЯ
  // Потрібно переглянути та додати можливі варіанти для вантажного таксі:
  // Списання: Withdraw (Виплата), Correction (Корекція), FuelAdvanceRepayment (Повернення авансу на пальне), CargoInsurance (Страхування вантажу), DamageFine (Штраф за пошкодження)
  // Поповнення: OrderFee (Оплата за замовлення), Tip (Чайові), Correction (Корекція), FuelAdvance (Аванс на пальне), Bonus (Бонус)
  @Field(() => DriverDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
  deductType?: DriverDeductTransactionType;

  @Field(() => DriverRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
  rechargeType?: DriverRechargeTransactionType;

  @FilterableField(() => Float) // Додано Float та фільтрацію
  amount: number;

  currency: string;
  refrenceNumber?: string; // Зовнішній ID транзакції (напр. виплати)

  @FilterableField(() => ID) // Зроблено фільтрованим
  driverId!: number;

  // ID пов'язаних сутностей
  @FilterableField(() => ID, { nullable: true })
  paymentGatewayId?: number; // Якщо це поповнення через платіжний шлюз

  @FilterableField(() => ID, { nullable: true })
  payoutSessionId?: number; // ID сесії виплат, якщо це частина масової виплати

  @FilterableField(() => ID, { nullable: true })
  payoutAccountId?: number; // ID банківського/платіжного рахунку водія

  @FilterableField(() => ID, { nullable: true })
  payoutMethodId?: number; // ID методу виплати, що використовувався

  @Field(() => ID, { nullable: true })
  operatorId?: number; // Якщо створено оператором

  @Field(() => ID, { nullable: true }) // Додано Field
  requestId?: number; // ID замовлення, до якого відноситься транзакція (напр. оплата за замовлення)

  description?: string; // Опис транзакції
}