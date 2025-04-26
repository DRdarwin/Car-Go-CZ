// admin-api/src/app/customer/customer.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Args, CONTEXT, ID, Mutation, Resolver } from '@nestjs/graphql';
import { OperatorPermission } from '@ridy/database/enums/operator-permission.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';
import { TransactionStatus } from '@ridy/database/enums/transaction-status.enum';
import { OperatorEntity } from '@ridy/database/operator.entity';
// Потрібно буде оновити SharedRiderService на SharedCustomerService (або адаптувати існуючий)
import { SharedRiderService } from '@ridy/order/shared-rider.service'; // TODO: Оновити/Адаптувати сервіс
import { ForbiddenError } from '@nestjs/apollo';
import { UserContext } from '../auth/authenticated-admin';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerTransactionInput } from './dto/customer-transaction.input'; // Оновлено
import { CustomerWalletDTO } from './dto/customer-wallet.dto'; // Оновлено
import { CustomerDTO } from './dto/customer.dto'; // Оновлено
import { DataSource } from 'typeorm';

// Перейменовуємо резолвер
@Resolver(() => CustomerDTO) // Вказуємо основний DTO
@UseGuards(JwtAuthGuard)
export class CustomerResolver { // Перейменовано
  constructor(
    // TODO: Замінити SharedRiderService на SharedCustomerService або адаптувати
    private sharedCustomerService: SharedRiderService,
    @Inject(CONTEXT)
    private context: UserContext,
    private datasource: DataSource,
  ) {}

  @Mutation(() => CustomerWalletDTO) // Повертає оновлений гаманець
  async createCustomerTransaction( // Перейменовано
    @Args('input', { type: () => CustomerTransactionInput }) // Використовуємо CustomerTransactionInput
    input: CustomerTransactionInput,
  ) {
    input.amount =
      input.action == TransactionAction.Recharge
        ? Math.abs(input.amount)
        : Math.abs(input.amount) * -1;
    // Викликаємо метод сервісу (який також потрібно буде адаптувати)
    return this.sharedCustomerService.rechargeWallet({
      ...input, // Передаємо customerId замість riderId
      operatorId: this.context.req.user.id,
      status: TransactionStatus.Done,
    });
  }

  @Mutation(() => CustomerDTO) // Повертає видаленого замовника
  async deleteOneCustomer( // Перейменовано
    @Args('id', { type: () => ID }) id: number,
  ): Promise<CustomerDTO> {
    const operator = await this.datasource
      .getRepository(OperatorEntity)
      .findOne({
        where: { id: this.context.req.user.id },
        relations: { role: true },
      });
    // TODO: Перевірити/оновити права доступу OperatorPermission.Riders_Edit
    if (!operator.role.permissions.includes(OperatorPermission.Riders_Edit)) {
      throw new ForbiddenError('PERMISSION_NOT_GRANTED');
    }
    // Викликаємо метод сервісу (який також потрібно буде адаптувати)
    return this.sharedCustomerService.deleteById(id);
  }
}