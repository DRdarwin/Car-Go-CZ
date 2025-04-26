// admin-api/src/app/payout/dto/payout-method.dto.ts
import {
  Field,
  Float,
  ID,
  MiddlewareContext,
  NextFn,
  ObjectType,
  registerEnumType, // Додано registerEnumType
} from '@nestjs/graphql';
import {
  Authorize,
  FilterableField, // Додано FilterableField
  FilterableRelation,
  IDField,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
// TODO: Перевірити/розширити цей Enum для вантажних перевезень (напр., FuelCard, B2BTransfer)
import { PayoutMethodType } from '@ridy/database/enums/payout-method-type.enum';
import { MediaDTO } from '../../upload/media.dto';
import { DriverTransactionDTO } from '../../driver/dto/driver-transaction.dto';
import { Stripe } from 'stripe';
import { PayoutAuthorizer } from '../payout.authorizer';
import { apiKeyMasker } from '../../payment-gateway/dto/payment-gateway.dto'; // Використовуємо маскування ключів

@ObjectType('PayoutMethod')
@Relation('media', () => MediaDTO, { nullable: true, description: 'Іконка методу виплат' })
@FilterableRelation('driverTransactions', () => DriverTransactionDTO, { description: 'Транзакції, пов\'язані з цим методом виплат' })
@Authorize(PayoutAuthorizer) // Застосовуємо авторизатор
export class PayoutMethodDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField({ description: 'Чи активний метод виплат' }) // Додано фільтрацію
  enabled: boolean;

  @FilterableField({ description: 'Валюта, в якій проводяться виплати' }) // Додано фільтрацію
  currency: string;

  name: string; // Назва методу (напр., "Stripe Connect", "Банківський переказ UAH")
  description?: string;

  @FilterableField(() => PayoutMethodType, { description: 'Тип методу виплат' }) // Додано фільтрацію // TODO: Перевірити/розширити Enum
  type: PayoutMethodType;

  // Ключі API (маскуються автоматично за допомогою apiKeyMasker)
  @Field(() => String, { nullable: true, middleware: [apiKeyMasker] })
  publicKey?: string;

  @Field(() => String, { nullable: true, middleware: [apiKeyMasker] })
  privateKey?: string;

  @Field(() => String, { nullable: true, middleware: [apiKeyMasker] })
  saltKey?: string;

  @Field(() => String, { nullable: true, middleware: [apiKeyMasker] })
  merchantId?: string;

  @Field(() => ID, { nullable: true })
  mediaId?: number;

  // Поле балансу - зараз специфічне для Stripe.
  // Можливо, варто зробити його більш загальним або винести логіку отримання балансу в сервіс.
  @Field(() => Float, {
    nullable: true,
    description: 'Поточний баланс на рахунку платіжної системи (якщо підтримується)',
    middleware: [
      async (context: MiddlewareContext, next: NextFn) => {
        // Поточна логіка ТІЛЬКИ для Stripe
        if (context.source.type === PayoutMethodType.Stripe && context.source.privateKey) {
          try {
            const stripe = new Stripe(context.source.privateKey, {
              apiVersion: '2022-11-15', // Перевірити актуальність версії API
            });
            const balance = await stripe.balance.retrieve();
            const availableBalance = balance.available.find(
              (b) =>
                b.currency.toLowerCase() ===
                context.source.currency.toLowerCase(),
            );
            // Повертаємо суму в основних одиницях (ділимо на 100 для копійок/центів)
            return availableBalance ? availableBalance.amount / 100 : 0;
          } catch (error) {
            console.error("Stripe balance retrieval error:", error.message);
            return null; // Повертаємо null у разі помилки
          }
        }
        // Для інших методів повертаємо null або реалізуємо відповідну логіку
        return null;
      },
    ],
  })
  balance?: number;
}