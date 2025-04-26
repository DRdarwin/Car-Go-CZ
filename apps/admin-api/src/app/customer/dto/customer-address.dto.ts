// admin-api/src/app/customer/dto/customer-address.dto.ts
import { FilterableField, IDField, Relation } from '@ptc-org/nestjs-query-graphql'; // Додано Relation
import { ID, ObjectType } from '@nestjs/graphql';
import { Point } from '@ridy/database';
// TODO: Розглянути перейменування/зміну Enum-ів, якщо типи адрес інші
import { RiderAddressType } from '@ridy/database/enums/rider-address-type.enum';
import { CustomerDTO } from './customer.dto'; // Імпортуємо CustomerDTO

@ObjectType('CustomerAddress') // Перейменовано
@Relation('customer', () => CustomerDTO) // Додаємо зв'язок з Customer
export class CustomerAddressDTO {
  @IDField(() => ID)
  id: number;

  @Field(() => RiderAddressType) // TODO: Розглянути зміну Enum
  type: RiderAddressType; // Наприклад, 'Home', 'Work', 'Saved'

  title: string; // Наприклад, "Офіс", "Склад №1"
  details?: string; // Додаткові деталі (під'їзд, код домофону)
  location: Point; // Координати

  @FilterableField(() => ID)
  customerId: number; // Перейменовано з riderId
}