// apps/admin-api/src/app/vehicle/dto/vehicle.dto.ts
import { FilterableField, IDField, Relation } from '@ptc-org/nestjs-query-graphql';
import { ObjectType, GraphQLISODateTime, Field, ID, Float, Int } from '@nestjs/graphql';
import { VehicleType } from '@ridy/database'; // Assuming exported from database index
import { MediaDTO } from '../../upload/media.dto'; // Assuming MediaDTO exists

@ObjectType('Vehicle')
@Relation('driver', () => DriverDTO, { nullable: true, disableRemove: true, disableUpdate: true }) // Assuming DriverDTO exists
@Relation('media', () => MediaDTO, { nullable: true })
export class VehicleDTO {
    @IDField(() => ID)
    id!: number;

    @FilterableField()
    name!: string;

    @FilterableField()
    plateNumber!: string;

    @FilterableField(() => VehicleType)
    type!: VehicleType;

    @FilterableField({ nullable: true })
    color?: string;

    @Field(() => Int, { nullable: true })
    productionYear?: number;

    @Field(() => Int, { nullable: true })
    loadCapacityKg?: number;

    @Field(() => ID, { nullable: true })
    mediaId?: number;

    // Add driverId if needed for frontend convenience
    @FilterableField(() => ID, { nullable: true })
    driverId?: number;
}

// Define DriverDTO briefly if not imported from elsewhere, just for the relation
@ObjectType('Driver')
class DriverDTO {
    @IDField(() => ID)
    id!: number;
}