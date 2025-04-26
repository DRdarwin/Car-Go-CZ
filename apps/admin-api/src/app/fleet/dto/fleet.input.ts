// admin-api/src/app/fleet/dto/fleet.input.ts
import { InputType, Field, Float } from '@nestjs/graphql'; // Додано Field, Float
import { Point } from '@ridy/database';
import { FleetType } from './fleet.dto'; // Імпортуємо Enum

@InputType()
export class FleetInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  mobileNumber: string;

  @Field()
  userName!: string; // Логін для входу

  @Field()
  password!: string; // Пароль для входу

  @Field({ nullable: true })
  accountNumber?: string;

  @Field(() => Float)
  commissionSharePercent!: number;

  @Field(() => Float)
  commissionShareFlat!: number;

  @Field(() => Float, { nullable: true })
  feeMultiplier?: number;

  @Field({ nullable: true })
  address?: string;

  @Field(() => [[Point]], { nullable: true })
  exclusivityAreas?: Point[][];

  @Field(() => FleetType, { defaultValue: FleetType.CARGO, description: 'Тип автопарку' })
  type: FleetType; // Додано тип автопарку
}