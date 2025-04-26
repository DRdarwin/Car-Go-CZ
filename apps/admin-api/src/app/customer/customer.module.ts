// admin-api/src/app/customer/customer.module.ts
import {
    NestjsQueryGraphQLModule,
    PagingStrategies,
  } from '@ptc-org/nestjs-query-graphql';
  import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
  import { Module } from '@nestjs/common';
  // Перейменовуємо сутності або створюємо нові
  import { CustomerAddressEntity } from '@ridy/database/customer-address.entity'; // Перейменовано
  import { CustomerEntity } from '@ridy/database/customer.entity'; // Перейменовано
  import { CustomerTransactionEntity } from '@ridy/database/customer-transaction.entity'; // Перейменовано
  import { CustomerWalletEntity } from '@ridy/database/customer-wallet.entity'; // Перейменовано
  // TODO: Адаптувати або замінити SharedRiderService
  import { SharedRiderService } from '@ridy/order/shared-rider.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { CustomerAddressDTO } from './dto/customer-address.dto'; // Оновлено
  import { CustomerTransactionDTO } from './dto/customer-transaction.dto'; // Оновлено
  import { CustomerWalletDTO } from './dto/customer-wallet.dto'; // Оновлено
  import { CustomerDTO } from './dto/customer.dto'; // Оновлено
  import { CustomerResolver } from './customer.resolver'; // Оновлено
  import { CustomerInput } from './dto/customer.input'; // Оновлено
  // DriverEntity може бути потрібним для якихось перевірок або логіки в SharedRiderService
  import { DriverEntity } from '@ridy/database/driver.entity';
  import { CustomerTransactionInput } from './dto/customer-transaction.input'; // Оновлено (додано для CreateDTOClass)
  
  @Module({ // Перейменовано модуль
    imports: [
      NestjsQueryGraphQLModule.forFeature({
        imports: [
          NestjsQueryTypeOrmModule.forFeature([
            // Використовуємо перейменовані сутності
            CustomerEntity,
            DriverEntity, // Залишаємо, якщо потрібно для SharedRiderService
            CustomerWalletEntity,
            CustomerTransactionEntity,
            CustomerAddressEntity,
          ]),
        ],
        resolvers: [
          {
            EntityClass: CustomerEntity,
            DTOClass: CustomerDTO,
            CreateDTOClass: CustomerInput, // Оновлено
            UpdateDTOClass: CustomerInput, // Оновлено
            create: { many: { disabled: true } },
            update: { many: { disabled: true } },
            // delete: { disabled: true }, // Залишаємо кастомний deleteOneCustomer
            read: { one: { name: 'customer' }, many: { name: 'customers' } }, // Оновлюємо назви запитів
            pagingStrategy: PagingStrategies.OFFSET,
            enableTotalCount: true,
            guards: [JwtAuthGuard],
          },
          {
            EntityClass: CustomerWalletEntity,
            DTOClass: CustomerWalletDTO,
            create: { disabled: true },
            update: { disabled: true },
            delete: { disabled: true },
            read: { one: { name: 'customerWallet' }, many: { name: 'customerWallets' } }, // Оновлюємо назви запитів
            pagingStrategy: PagingStrategies.OFFSET,
            enableTotalCount: true,
            guards: [JwtAuthGuard],
          },
          {
            EntityClass: CustomerTransactionEntity,
            DTOClass: CustomerTransactionDTO,
            // Дозволяємо створення транзакцій через кастомну мутацію
            // CreateDTOClass: CustomerTransactionInput, // Не використовуємо стандартне створення
            create: { disabled: true }, // Вимикаємо стандартне створення
            update: { disabled: true },
            delete: { disabled: true },
            read: { one: { name: 'customerTransaction' }, many: { name: 'customerTransactions' } }, // Оновлюємо назви запитів
            pagingStrategy: PagingStrategies.OFFSET,
            enableTotalCount: true,
            guards: [JwtAuthGuard],
          },
          {
            EntityClass: CustomerAddressEntity,
            DTOClass: CustomerAddressDTO,
            // Можливо, знадобиться CreateDTOClass/UpdateDTOClass, якщо адреси редагуються тут
            create: { disabled: true }, // Припускаємо, що адреси керуються через Customer DTO
            update: { disabled: true },
            delete: { disabled: true },
            read: { one: { name: 'customerAddress' }, many: { name: 'customerAddresses' } }, // Оновлюємо назви запитів
            pagingStrategy: PagingStrategies.OFFSET,
            enableTotalCount: true,
            guards: [JwtAuthGuard],
          },
        ],
      }),
    ],
    // Реєструємо оновлений резолвер та сервіс (який потрібно буде адаптувати)
    providers: [CustomerResolver, SharedRiderService], // TODO: Адаптувати SharedRiderService
  })
  export class CustomerModule {} // Перейменовано