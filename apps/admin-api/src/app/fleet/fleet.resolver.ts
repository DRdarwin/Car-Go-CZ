// admin-api/src/app/fleet/fleet.resolver.ts
import { Inject, UseGuards } from "@nestjs/common";
import { GuardsConsumer } from "@nestjs/core/guards/guards-consumer";
import { Args, CONTEXT, Mutation, Resolver } from "@nestjs/graphql";
import { TransactionAction } from "@ridy/database/enums/transaction-action.enum";
// TODO: Адаптувати SharedFleetService
import { SharedFleetService } from "@ridy/order/shared-fleet.service";
import { UserContext } from "../auth/authenticated-admin";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { FleetTransactionInput } from "./dto/fleet-transaction.input";
import { FleetWalletDTO } from "./dto/fleet-wallet.dto";
import { FleetDTO } from "./dto/fleet.dto"; // Імпортуємо основний DTO

// Вказуємо основний DTO для резолвера
@Resolver(() => FleetDTO)
@UseGuards(JwtAuthGuard)
export class FleetResolver {
    constructor(
        // TODO: Адаптувати або замінити SharedFleetService
        private sharedFleetService: SharedFleetService,
        @Inject(CONTEXT)
        private context: UserContext
    ) { }

    @Mutation(() => FleetWalletDTO) // Повертає оновлений гаманець
    async createFleetTransaction(@Args('input', { type: () => FleetTransactionInput }) input: FleetTransactionInput) {
        input.amount = input.action == TransactionAction.Recharge ? Math.abs(input.amount) : Math.abs(input.amount) * -1;
        // Потрібно переконатись, що sharedFleetService коректно працює з ID автопарку
        return this.sharedFleetService.rechargeWallet({ ...input, operatorId: this.context.req.user.id });
    }
}