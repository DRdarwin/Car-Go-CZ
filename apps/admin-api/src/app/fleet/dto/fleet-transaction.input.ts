// admin-api/src/app/fleet/dto/fleet-transaction.input.ts
import { Field, Float, ID, InputType } from '@nestjs/graphql'; // Додано Float
// TODO: Переглянути ці Enum-и на релевантність для вантажних автопарків
import { ProviderDeductTransactionType } from '@ridy/database/enums/provider-deduct-transaction-type.enum';
import { ProviderRechargeTransactionType } from '@ridy/database/enums/provider-recharge-transaction-type.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';

@InputType()
export class FleetTransactionInput {
    @Field(() => TransactionAction)
    action: TransactionAction;

    @Field(() => ProviderDeductTransactionType, { nullable: true }) // TODO: Переглянути Enum
    deductType?: ProviderDeductTransactionType;

    @Field(() => ProviderRechargeTransactionType, { nullable: true }) // TODO: Переглянути Enum
    rechargeType?: ProviderRechargeTransactionType;

    @Field(() => Float)
    amount: number;

    currency: string;
    refrenceNumber?: string;

    @Field(() => ID)
    fleetId!: number;

    description?: string;
}