// admin-api/src/app/service/dto/service-category.input.ts
import { Field, InputType } from '@nestjs/graphql'; // Додано Field

@InputType()
export class ServiceCategoryInput {
  @Field()
  name!: string;

  @Field({ nullable: true, description: 'Детальний опис категорії' })
  description?: string; // Додано опціональний опис

  @Field({ defaultValue: true, description: 'Чи активна категорія' }) // За замовчуванням активна
  enabled: boolean;
}