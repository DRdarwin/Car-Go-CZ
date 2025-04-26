// admin-api/src/app/fleet/dto/fleet.dto.ts
import {
  Authorize,
  CursorConnection,
  FilterableField,
  IDField,
  OffsetConnection,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'; // Додано Float, Field, registerEnumType
import { Point } from '@ridy/database';
import { ZonePriceDTO } from '../../service/dto/zone-price.dto'; // Можливо, зони будуть прив'язані до автопарків
import { FleetTransactionDTO } from './fleet-transaction.dto';
import { FleetWalletDTO } from './fleet-wallet.dto';
import { FleetAuthorizer } from './fleet.authorizer';
import { DriverDTO } from '../../driver/dto/driver.dto'; // Для зв'язку з водіями

// Додаємо Enum для типу автопарку
export enum FleetType {
  PASSENGER = 'Passenger',
  CARGO = 'Cargo',
  MIXED = 'Mixed',
}
registerEnumType(FleetType, { name: 'FleetType' });

@ObjectType('Fleet')
@UnPagedRelation('wallet', () => FleetWalletDTO, { relationName: 'wallet' })
@OffsetConnection('transactions', () => FleetTransactionDTO)
@OffsetConnection('zonePrices', () => ZonePriceDTO) // Ціни зон, специфічні для автопарку
@OffsetConnection('drivers', () => DriverDTO) // Додаємо зв'язок з водіями цього автопарку
@Authorize(FleetAuthorizer)
export class FleetDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField()
  name!: string; // Назва автопарку

  phoneNumber?: string; // Стаціонарний номер (опціонально)
  mobileNumber: string; // Мобільний номер (обов'язково)

  // Дані для входу в кабінет автопарку (якщо є окремий)
  userName?: string;
  // password?: string; // Пароль зазвичай не повертається в DTO

  accountNumber?: string; // Банківський рахунок

  // Комісії
  @Field(() => Float)
  commissionSharePercent!: number; // Відсоток комісії для автопарку

  @Field(() => Float)
  commissionShareFlat!: number; // Фіксована комісія для автопарку

  @Field(() => Float, { nullable: true, description: 'Загальний множник тарифу для цього автопарку' })
  feeMultiplier?: number;

  address?: string; // Адреса офісу/бази

  // Зони ексклюзивності (якщо потрібно)
  exclusivityAreas?: Point[][];

  @Field(() => FleetType, { defaultValue: FleetType.CARGO, description: 'Тип автопарку' })
  type: FleetType; // Додано тип автопарку
}