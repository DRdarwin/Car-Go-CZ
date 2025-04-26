// apps/admin-api/src/app/vehicle/vehicle.module.ts
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { VehicleEntity } from '@ridy/database'; // Import NEW VehicleEntity
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VehicleDTO } from './dto/vehicle.dto'; // Import NEW DTO
import { VehicleInput } from './dto/vehicle.input'; // Import NEW Input DTO
// import { VehicleAuthorizer } from './dto/vehicle.authorizer'; // Keep authorizer logic separate for now

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([VehicleEntity]), // Use NEW VehicleEntity
      ],
      // services: [VehicleAuthorizer], // Add authorizer if/when fixed
      resolvers: [
        {
          EntityClass: VehicleEntity,       // Use NEW VehicleEntity
          DTOClass: VehicleDTO,          // Use NEW DTO
          CreateDTOClass: VehicleInput,    // Use NEW Input DTO
          UpdateDTOClass: VehicleInput,    // Use NEW Input DTO
          // Remove 'authorizer' temporarily to fix build errors
          // read: { authorizer: VehicleAuthorizer },
          // create: { authorizer: VehicleAuthorizer, many: { disabled: true } },
          // update: { authorizer: VehicleAuthorizer, many: { disabled: true } },
          // delete: { authorizer: VehicleAuthorizer, many: { disabled: true } },
          // --- Standard options ---
          create: { many: { disabled: true } }, // Disable creating many at once
          update: { many: { disabled: true } }, // Disable updating many at once
          delete: { many: { disabled: true } }, // Disable deleting many at once
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
          guards: [JwtAuthGuard], // Apply JWT guard
        },
        // Remove the old resolver configurations for VehicleColorEntity and VehicleModelEntity
      ],
    }),
  ],
})
export class VehicleModule { }