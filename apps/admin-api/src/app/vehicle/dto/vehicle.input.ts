// apps/admin-api/src/app/vehicle/dto/vehicle.input.ts
import { Field, ID, InputType, Int, Float } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { VehicleType } from '@ridy/database'; // Assuming exported from database index

@InputType()
export class VehicleInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name!: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    plateNumber!: string;

    @Field(() => VehicleType)
    @IsEnum(VehicleType)
    type!: VehicleType;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    color?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1980)
    @Max(2030) // Adjust range as needed
    productionYear?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    loadCapacityKg?: number;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    @IsInt()
    mediaId?: number;

    // driverId might be handled via a separate mutation if needed
    // @Field(() => ID, { nullable: true })
    // @IsOptional()
    // @IsInt()
    // driverId?: number;
}