// apps/rider-api/src/app/order/dto/calculate-fare.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { Point, VehicleType } from '@ridy/database/enums/vehicle-type.enum'; // NEW: Import VehicleType
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator'; // NEW: Import validators

// NEW: Make sure Point is correctly defined and potentially decorated for GraphQL elsewhere
// For example:
// import { ObjectType } from '@nestjs/graphql';
// @ObjectType()
// export class Point {
//   @Field()
//   lat!: number;
//   @Field()
//   lng!: number;
// }
// If Point is purely internal, the @Field decorator below might not be needed,
// but it's good practice for GraphQL inputs. Assuming Point is setup for GraphQL.

@InputType()
export class CalculateFareInput {
  @Field(() => [Point]) // Added Field decorator for points
  points!: Point[];

  @Field(() => VehicleType) // NEW: Add vehicleType field
  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @Field(() => Int) // NEW: Add loadersCount field
  @IsInt()
  @Min(0)
  loadersCount!: number;

  @Field({ nullable: true }) // Make field explicitly nullable in GraphQL Schema
  @IsOptional()
  twoWay?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  couponCode?: string;

  @Field(() => [String], { nullable: true }) // Define type for GraphQL array
  @IsOptional()
  selectedOptionIds?: string[];

  @Field(() => Int, { nullable: true, defaultValue: 0 }) // Use defaultValue if appropriate
  @IsOptional()
  @IsInt()
  @Min(0)
  waitTime?: number = 0; // Assign default value
}

// IMPORTANT: Remember to register the VehicleType enum in your GraphQL module (e.g., AppModule or OrderModule)
// using registerEnumType(VehicleType, { name: 'VehicleType' });