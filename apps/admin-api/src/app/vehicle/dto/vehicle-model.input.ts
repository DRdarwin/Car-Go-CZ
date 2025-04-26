// admin-api/src/app/vehicle/dto/vehicle-model.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { VehicleType } from './vehicle-model.dto';

@InputType()
export class VehicleModelInput {
  @Field()
  name: string;

  @Field(() => VehicleType, { description: 'Тип транспортного засобу' })
  type: VehicleType; // Додано тип ТЗ

  @Field(() => Int, { nullable: true, description: 'Максимальна вантажопідйомність (кг)'})
  payloadCapacityKg?: number; // Додано вантажопідйомність

  @Field(() => Int, { nullable: true, description: 'Максимальний об\'єм кузова (м³)' })
  volumeCapacityM3?: number; // Додано об'єм

  @Field({ nullable: true, description: 'Наявність гідроборта' })
  hasTailLift?: boolean; // Додано гідроборт
}