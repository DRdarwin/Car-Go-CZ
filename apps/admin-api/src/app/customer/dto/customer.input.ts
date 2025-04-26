// admin-api/src/app/customer/dto/customer.input.ts
import { InputType, Field } from '@nestjs/graphql'; // Додано Field
import { Gender } from '@ridy/database/enums/gender.enum';
import { RiderStatus } from '@ridy/database/enums/rider-status.enum'; // TODO: Розглянути зміну

@InputType()
export class CustomerInput { // Перейменовано з RiderInput
  @Field(() => RiderStatus, { nullable: true }) // TODO: Розглянути зміну Enum
  status?: RiderStatus;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  mobileNumber?: string;

  // registrationTimestamp зазвичай не оновлюється вручну
  // registrationTimestamp?: Date;

  @Field({ nullable: true })
  email?: string;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field({ nullable: true })
  isResident?: boolean;

  @Field({ nullable: true })
  idNumber?: string;
}