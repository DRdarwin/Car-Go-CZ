// admin-api/src/app/customer/dto/customer-wallet.dto.ts
import {
    FilterableField,
    IDField,
    Relation,
  } from '@ptc-org/nestjs-query-graphql';
  import { Float, ID, ObjectType } from '@nestjs/graphql';
  import { CustomerDTO } from './customer.dto'; // Оновлено імпорт
  
  @ObjectType('CustomerWallet') // Перейменовано
  @Relation('customer', () => CustomerDTO, { nullable: true }) // Оновлено тип та назву зв'язку
  export class CustomerWalletDTO {
    @IDField(() => ID)
    id: number;
  
    @FilterableField(() => Float)
    balance: number;
  
    currency: string;
  
    @FilterableField(() => ID, { nullable: true }) // Додано nullable, якщо зв'язок може бути відсутнім
    customerId?: number; // Перейменовано з riderId
  }