// admin-api/src/app/vehicle/dto/vehicle-model.dto.ts
import { Authorize, IDField } from '@ptc-org/nestjs-query-graphql';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { VehicleAuthorizer } from './vehicle.authorizer';

// Додано новий Enum для типів транспорту
export enum VehicleType {
  CAR = 'Car', // Легковий автомобіль (якщо потрібно підтримувати і його)
  VAN = 'Van', // Фургон
  TRUCK_SMALL = 'TruckSmall', // Мала вантажівка
  TRUCK_MEDIUM = 'TruckMedium', // Середня вантажівка
  TRUCK_LARGE = 'TruckLarge', // Велика вантажівка
  REFRIGERATOR = 'Refrigerator', // Рефрижератор
}
registerEnumType(VehicleType, { name: 'VehicleType' });


@ObjectType('VehicleModel')
@Authorize(VehicleAuthorizer)
export class VehicleModelDTO {
  @IDField(() => ID)
  id: number;

  name: string;

  @Field(() => VehicleType, { description: 'Тип транспортного засобу' })
  type: VehicleType; // Додано тип ТЗ

  @Field({ nullable: true, description: 'Максимальна вантажопідйомність (кг)'})
  payloadCapacityKg?: number; // Додано вантажопідйомність

  @Field({ nullable: true, description: 'Максимальний об\'єм кузова (м³)' })
  volumeCapacityM3?: number; // Додано об'єм

  @Field({ nullable: true, description: 'Наявність гідроборта' })
  hasTailLift?: boolean; // Додано гідроборт
}