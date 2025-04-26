// admin-api/src/app/driver/dto/driver.input.ts
import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
import { DriverStatus } from '@ridy/database/enums/driver-status.enum';
import { Gender } from '@ridy/database/enums/gender.enum';

@InputType()
export class UpdateDriverInput {
  @Field(() => ID, { nullable: true })
  fleetId?: number;

  // Поля, що стосуються транспорту
  @Field(() => ID, { nullable: true })
  vehicleModelId?: number; // Замінено carId на vehicleModelId

  @Field(() => ID, { nullable: true })
  vehicleColorId?: number; // Замінено carColorId на vehicleColorId

  @Field({ nullable: true })
  vehiclePlate?: string; // Перейменовано carPlate на vehiclePlate

  // Інші поля водія
  @Field({ nullable: true })
  mobileNumber?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  certificateNumber?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  status?: DriverStatus;

  @Field({ nullable: true })
  gender?: Gender;

  @Field({ nullable: true })
  accountNumber?: string;

  @Field({ nullable: true })
  bankName?: string;

  @Field({ nullable: true })
  bankRoutingNumber?: string;

  @Field({ nullable: true })
  bankSwift?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  softRejectionNote?: string;

  @Field(() => ID, { nullable: true })
  mediaId?: number; // ID фото водія
}