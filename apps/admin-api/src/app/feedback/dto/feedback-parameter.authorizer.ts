// admin-api/src/app/feedback/dto/feedback-parameter.authorizer.ts
import { Filter } from '@ptc-org/nestjs-query-core';
import {
  CustomAuthorizer,
  AuthorizationContext,
} from '@ptc-org/nestjs-query-graphql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OperatorPermission } from '@ridy/database/enums/operator-permission.enum';
import { OperatorEntity } from '@ridy/database/operator.entity';
import { DataSource } from 'typeorm';
import { UserContext } from '../../auth/authenticated-admin';

@Injectable()
export class FeedbackParameterAuthorizer implements CustomAuthorizer<any> {
  constructor(private datasource: DataSource) { }

  async authorize(
    context: UserContext,
    authorizerContext: AuthorizationContext,
  ): Promise<Filter<any>> {
    if (authorizerContext.readonly) {
      // Дозвіл на читання параметрів зазвичай не потрібен або відкритий
      return undefined;
    }
    const operator = await this.datasource
      .getRepository(OperatorEntity)
      .findOne({
        where: { id: context.req.user.id },
        relations: { role: true },
      });

    // Перевіряємо право на редагування параметрів відгуків
    const editPermission = OperatorPermission.ReviewParameter_Edit; // TODO: Перевірити/перейменувати право

    if (
      !authorizerContext.readonly &&
      !operator.role.permissions.includes(editPermission)
    ) {
      throw new UnauthorizedException();
    }
    return undefined;
  }
}