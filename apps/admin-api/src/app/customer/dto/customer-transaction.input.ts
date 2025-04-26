// admin-api/src/app/customer/dto/customer-transaction.input.ts
import { Field, Float, ID, InputType } from "@nestjs/graphql"; // Додано Float
// TODO: Розглянути перейменування/зміну Enum-ів
import { RiderDeductTransactionType } from "@ridy/database/enums/rider-deduct-transaction-type.enum";
import { RiderRechargeTransactionType } from "@ridy/database/enums/rider-recharge-transaction-type.enum";
import { TransactionAction } from "@ridy/database/enums/transaction-action.enum";

@InputType()
export class CustomerTransactionInput { // Перейменовано з RiderTransactionInput
    @Field(() => TransactionAction)
    action: TransactionAction;

    @Field(() => RiderDeductTransactionType, { nullable: true }) // TODO: Розглянути зміну Enum
    deductType?: RiderDeductTransactionType;

    @Field(() => RiderRechargeTransactionType, { nullable: true }) // TODO: Розглянути зміну Enum
    rechargeType?: RiderRechargeTransactionType;

    @Field(() => Float)
    amount: number;

    currency: string;
    refrenceNumber?: string;
    description?: string;

    @Field(() => ID)
    customerId!: number; // Перейменовано з riderId
}