// admin-api/src/app/customer/dto/customer-transaction.dto.ts
import {
    FilterableField,
    IDField,
    Relation,
  } from '@ptc-org/nestjs-query-graphql';
  import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
  // TODO: Розглянути перейменування Enum-ів, якщо логіка списання/поповнення змінюється
  import { RiderDeductTransactionType } from '@ridy/database/enums/rider-deduct-transaction-type.enum';
  import { RiderRechargeTransactionType } from '@ridy/database/enums/rider-recharge-transaction-type.enum';
  import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';
  import { TransactionStatus } from '@ridy/database/enums/transaction-status.enum';
  
  import { OperatorDTO } from '../../operator/dto/operator.dto';
  import { PaymentGatewayDTO } from '../../payment-gateway/dto/payment-gateway.dto';
  import { CustomerDTO } from './customer.dto'; // Оновлено імпорт
  
  @ObjectType('CustomerTransaction') // Перейменовано
  @Relation('operator', () => OperatorDTO, { nullable: true })
  @Relation('paymentGateway', () => PaymentGatewayDTO, { nullable: true })
  @Relation('customer', () => CustomerDTO) // Оновлено тип та назву зв'язку
  export class CustomerTransactionDTO {
    @IDField(() => ID)
    id: number;
  
    action: TransactionAction; // Recharge, Deduct
  
    @FilterableField()
    createdAt: Date;
  
    // Типи списання/поповнення - можливо, потребують нових значень для вантажів
    deductType?: RiderDeductTransactionType; // TODO: Розглянути зміну Enum
    rechargeType?: RiderRechargeTransactionType; // TODO: Розглянути зміну Enum
  
    status: TransactionStatus; // Pending, Success, Failed
  
    @FilterableField(() => Float)
    amount: number;
  
    @FilterableField(() => String)
    currency: string;
  
    refrenceNumber?: string; // Наприклад, ID транзакції платіжної системи
    description?: string; // Опис, видимий адміну/користувачу
  
    @FilterableField(() => ID)
    customerId!: number; // Перейменовано з riderId
  
    @Field(() => ID, { nullable: true })
    paymentGatewayId?: number;
  
    @Field(() => ID, { nullable: true })
    operatorId?: number; // Якщо транзакція створена оператором
  
    @Field(() => ID, { nullable: true })
    requestId?: number; // ID Замовлення, до якого відноситься транзакція
  }