// admin-api/src/app/service/dto/service-category.dto.ts
import {
  Authorize,
  FilterableField, // Додано FilterableField
  IDField,
  PagingStrategies,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql'; // Додано Field
import { ServiceAuthorizer } from './service.authorizer';
import { ServiceDTO } from './service.dto';

@ObjectType('ServiceCategory')
@UnPagedRelation('services', () => ServiceDTO, {
  pagingStrategy: PagingStrategies.NONE,
})
@Authorize(ServiceAuthorizer)
export class ServiceCategoryDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField() // Дозволяємо фільтрацію за назвою
  name!: string; // Наприклад: "До 1.5т", "Рефрижератор", "З гідробортом"

  @Field({ nullable: true, description: 'Детальний опис категорії' })
  description?: string; // Додано опціональний опис

  @Field({ description: 'Чи активна категорія' })
  enabled!: boolean; // Додано поле enabled, яке було у Input
}