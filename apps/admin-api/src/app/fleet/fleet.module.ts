// admin-api/src/app/fleet/fleet.module.ts
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { FleetTransactionEntity } from '@ridy/database/fleet-transaction.entity';
import { FleetWalletEntity } from '@ridy/database/fleet-wallet.entity';
import { FleetEntity } from '@ridy/database/fleet.entity';
// TODO: Адаптувати або замінити SharedFleetService
import { SharedFleetService } from '@ridy/order/shared-fleet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FleetTransactionDTO } from './dto/fleet-transaction.dto';
import { FleetWalletDTO } from './dto/fleet-wallet.dto';
import { FleetDTO, FleetType } from './dto/fleet.dto'; // Імпортовано FleetType
import { FleetResolver } from './fleet.resolver';
import { FleetInput } from './dto/fleet.input';
import { FleetAuthorizer } from './dto/fleet.authorizer'; // Імпортовано авторизатор
import { FleetTransactionInput } from './dto/fleet-transaction.input'; // Імпортовано вхідні дані транзакції

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          FleetEntity,
          FleetTransactionEntity,
          FleetWalletEntity,
        ]),
      ],
      // Додаємо авторизатор
      services: [FleetAuthorizer],
      resolvers: [
        {
          EntityClass: FleetEntity,
          DTOClass: FleetDTO,
          CreateDTOClass: FleetInput,
          UpdateDTOClass: FleetInput,
          // Застосовуємо авторизатор до CRUD операцій
          read: { one: { name: 'fleet' }, many: { name: 'fleets' }, authorizer: FleetAuthorizer },
          create: { authorizer: FleetAuthorizer, many: { disabled: true } },
          update: { authorizer: FleetAuthorizer, many: { disabled: true } },
          delete: { authorizer: FleetAuthorizer, disabled: true }, // Видалення може бути кастомним
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
          guards: [JwtAuthGuard],
        },
        {
          EntityClass: FleetWalletEntity,
          DTOClass: FleetWalletDTO,
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          read: { one: { name: 'fleetWallet' }, many: { name: 'fleetWallets' }, authorizer: FleetAuthorizer }, // Додано авторизатор
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
          guards: [JwtAuthGuard],
        },
        {
          EntityClass: FleetTransactionEntity,
          DTOClass: FleetTransactionDTO,
          // CreateDTOClass: FleetTransactionInput, // Використовуємо кастомну мутацію
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          read: { one: { name: 'fleetTransaction' }, many: { name: 'fleetTransactions' }, authorizer: FleetAuthorizer }, // Додано авторизатор
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
          guards: [JwtAuthGuard],
        },
      ],
    }),
  ],
  // Реєструємо резолвер та сервіс (який потрібно адаптувати)
  providers: [FleetResolver, SharedFleetService], // TODO: Адаптувати SharedFleetService
})
export class FleetModule { }