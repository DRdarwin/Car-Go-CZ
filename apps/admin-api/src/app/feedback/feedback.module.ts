// admin-api/src/app/feedback/feedback.module.ts
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { FeedbackParameterEntity } from '@ridy/database/feedback-parameter.entity';
import { FeedbackEntity } from '@ridy/database/feedback.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FeedbackParameterDTO } from './dto/feedback-parameter.dto';
import { FeedbackDTO } from './dto/feedback.dto';
import { FeedbackParameterInput } from './dto/feedback-parameter.input';
import { FeedbackParameterAuthorizer } from './dto/feedback-parameter.authorizer'; // Імпортуємо авторизатор

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          FeedbackEntity,
          FeedbackParameterEntity,
        ]),
      ],
      // Додаємо авторизатор як сервіс
      services: [FeedbackParameterAuthorizer],
      resolvers: [
        {
          EntityClass: FeedbackEntity,
          DTOClass: FeedbackDTO,
          create: { disabled: true }, // Відгуки створюються клієнтами/водіями
          update: { disabled: true },
          delete: { disabled: true },
          read: { one: { name: 'feedback' }, many: { name: 'feedbacks' } },
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
          guards: [JwtAuthGuard],
        },
        {
          EntityClass: FeedbackParameterEntity,
          DTOClass: FeedbackParameterDTO,
          CreateDTOClass: FeedbackParameterInput,
          UpdateDTOClass: FeedbackParameterInput,
          // Застосовуємо авторизатор до CRUD операцій для параметрів
          read: { one: { name: 'feedbackParameter' }, many: { name: 'feedbackParameters' }, authorizer: FeedbackParameterAuthorizer },
          create: { authorizer: FeedbackParameterAuthorizer, many: { disabled: true } },
          update: { authorizer: FeedbackParameterAuthorizer, many: { disabled: true } },
          delete: { authorizer: FeedbackParameterAuthorizer, many: { disabled: true } },
          pagingStrategy: PagingStrategies.NONE,
          guards: [JwtAuthGuard],
        },
      ],
    }),
  ],
})
export class FeedbackModule { }