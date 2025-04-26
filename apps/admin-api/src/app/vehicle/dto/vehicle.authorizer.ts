// admin-api/src/app/vehicle/dto/vehicle.authorizer.ts
import { Filter } from '@ptc-org/nestjs-query-core';
import {
  CustomAuthorizer,
  AuthorizationContext,
} from '@ptc-org/nestjs-query-graphql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Потенційно перейменувати права доступу або додати нові для вантажівок
import { OperatorPermission } from '@ridy/database/enums/operator-permission.enum';
import { OperatorEntity } from '@ridy/database/operator.entity';
import { DataSource } from 'typeorm';
import { UserContext } from '../../auth/authenticated-admin';

@Injectable()
export class VehicleAuthorizer implements CustomAuthorizer<any> {
  constructor(private datasource: DataSource) {}

  async authorize(
    context: UserContext,
    authorizerContext: AuthorizationContext,
  ): Promise<Filter<any>> {
    const operator = await this.datasource
      .getRepository(OperatorEntity)
      .findOne({
        where: { id: context.req.user.id },
        relations: { role: true },
      });

    // Перевіряємо права доступу (можливо, треба буде створити нові, наприклад, Vehicles_View/Edit)
    const viewPermission = OperatorPermission.Cars_View; // TODO: Замінити на Vehicles_View, якщо буде створено
    const editPermission = OperatorPermission.Cars_Edit; // TODO: Замінити на Vehicles_Edit, якщо буде створено

    if (
      authorizerContext.readonly &&
      !operator.role.permissions.includes(viewPermission)
    ) {
      throw new UnauthorizedException();
    }
    if (
      !authorizerContext.readonly &&
      !operator.role.permissions.includes(editPermission)
    ) {
      if (
        authorizerContext.operationGroup === 'create' ||
        authorizerContext.operationGroup === 'update' ||
        authorizerContext.operationGroup === 'delete'
      ) {
        throw new UnauthorizedException();
      }
    }
    return undefined;
  }
}