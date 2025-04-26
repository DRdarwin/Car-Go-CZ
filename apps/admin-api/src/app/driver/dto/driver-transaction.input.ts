// admin-api/src/app/driver/dto/driver-transaction.input.ts
import { Field, Float, ID, InputType } from "@nestjs/graphql"; // Додано Float
// TODO: Перевірити/розширити ці Enum-и
import { DriverDeductTransactionType, DriverRechargeTransactionType, TransactionAction } from '@ridy/database';
@InputType()
export class DriverTransactionInput {
    @Field(() => TransactionAction)
    action: TransactionAction; // Recharge / Deduct

    @Field(() => DriverDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    deductType?: DriverDeductTransactionType;

    @Field(() => DriverRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    rechargeType?: DriverRechargeTransactionType;

    @Field(() => Float) // Додано Float
    amount: number;

    currency: string;
    refrenceNumber?: string;

    @Field(() => ID)
    driverId!: number; // ID водія, для якого створюється транзакція

    description?: string;
}