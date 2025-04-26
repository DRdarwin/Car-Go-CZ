// admin-api/src/app/fleet/dto/fleet.authorizer.ts
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
export class FleetAuthorizer implements CustomAuthorizer<any> {
  constructor(private datasource: DataSource) { }

  async authorize(
    context: UserContext,
    authorizerContext: AuthorizationContext,
  ): Promise<Filter<any>> {
    const operator = await this.datasource
      .getRepository(OperatorEntity)
      .findOne({ where: { id: context.req.user.id }, relations: ['role'] });

    const viewPermission = OperatorPermission.Fleets_View; // TODO: Перевірити/оновити права
    const editPermission = OperatorPermission.Fleets_Edit; // TODO: Перевірити/оновити права

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
      throw new UnauthorizedException();
    }
    return undefined;
  }
}