// admin-api/src/app/customer/dto/customer.dto.ts
import {
    FilterableField,
    IDField,
    OffsetConnection,
    Relation,
  } from '@ptc-org/nestjs-query-graphql';
  import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
  import { Gender } from '@ridy/database/enums/gender.enum';
  // Можливо, статус потрібно буде переглянути (наприклад, 'Active', 'Blocked')
  import { RiderStatus } from '@ridy/database/enums/rider-status.enum';
  import { numberMasker } from '../../number.masker.middleware';
  import { OrderDTO } from '../../order/dto/order.dto'; // OrderDTO буде посилатись на customerId
  import { MediaDTO } from '../../upload/media.dto';
  import { CustomerAddressDTO } from './customer-address.dto'; // Перейменовано
  import { CustomerTransactionDTO } from './customer-transaction.dto'; // Перейменовано
  import { CustomerWalletDTO } from './customer-wallet.dto'; // Перейменовано
  
  // Перейменовуємо тип об'єкта GraphQL
  @ObjectType('Customer')
  @OffsetConnection('addresses', () => CustomerAddressDTO) // Оновлено тип
  @OffsetConnection('wallet', () => CustomerWalletDTO) // Оновлено тип
  @OffsetConnection('transactions', () => CustomerTransactionDTO) // Оновлено тип
  @OffsetConnection('orders', () => OrderDTO) // Зв'язок з замовленнями залишається
  @Relation('media', () => MediaDTO, { nullable: true }) // Аватар користувача
  export class CustomerDTO {
    @IDField(() => ID)
    id!: number;
  
    // Статус Замовника - можливо, потребує інших значень
    status: RiderStatus; // TODO: Розглянути перейменування/зміну Enum RiderStatus
  
    @FilterableField()
    firstName?: string;
  
    @FilterableField()
    lastName?: string;
  
    @FilterableField(() => String, { middleware: [numberMasker] })
    mobileNumber: string;
  
    registrationTimestamp: Date;
    email?: string;
  
    @Field(() => Gender, { nullable: true })
    gender?: Gender;
  
    // Поля isResident та idNumber можуть бути нерелевантними для всіх типів замовників
    isResident?: boolean;
    idNumber?: string;
  }