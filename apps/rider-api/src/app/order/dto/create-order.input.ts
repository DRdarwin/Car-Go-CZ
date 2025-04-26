// apps/rider-api/src/app/order/dto/create-order.input.ts
import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Point, VehicleType } from '@ridy/database/enums/vehicle-type.enum'; // NEW: Import VehicleType
import { PaymentMode } from '@ridy/database/enums/payment-mode.enum';
// NEW: Import validators
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

// Assuming Point is setup for GraphQL elsewhere
// Assuming PaymentMode enum is registered with GraphQL

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  @IsInt()
  serviceId!: number;

  @Field(() => VehicleType) // NEW: Add vehicleType field
  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @Field(() => Int) // NEW: Add loadersCount field
  @IsInt()
  @Min(0)
  loadersCount!: number;

  @Field(() => [Point]) // Added Field decorator
  @IsArray() // Add array validation
  points!: Point[];

  @Field(() => [String]) // Added Field decorator
  @IsArray() // Add array validation
  @IsString({ each: true }) // Validate each item in the array
  addresses!: string[];

  @Field(() => Int)
  @IsInt()
  intervalMinutes!: number;

  @Field({ nullable: true })
  @IsOptional()
  twoWay?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  waitTime?: number = 0; // Assign default value

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @Field(() => PaymentMode, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentMode)
  paymentMode?: PaymentMode;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsInt() // Assuming ID maps to a number internally
  paymentMethodId?: number;
}

// IMPORTANT: Remember to register the VehicleType enum in your GraphQL module (e.g., AppModule or OrderModule)
// using registerEnumType(VehicleType, { name: 'VehicleType' });