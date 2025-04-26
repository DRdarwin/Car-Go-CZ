// admin-api/src/app/vehicle/dto/vehicle-color.dto.ts
import { Authorize, IDField } from '@ptc-org/nestjs-query-graphql';
import { ID, ObjectType } from '@nestjs/graphql';
import { VehicleAuthorizer } from './vehicle.authorizer';

@ObjectType('VehicleColor')
@Authorize(VehicleAuthorizer)
export class VehicleColorDTO {
  @IDField(() => ID)
  id: number;
  name: string;
}