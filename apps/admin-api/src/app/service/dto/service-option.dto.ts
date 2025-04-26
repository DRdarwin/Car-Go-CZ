// admin-api/src/app/service/dto/service-option.dto.ts
import { Authorize, FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';
import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'; // Додано Float, registerEnumType
import { ServiceAuthorizer } from './service.authorizer';

// Оновлені типи опцій для вантажного таксі
export enum CargoServiceOptionType {
  BOOLEAN = 'Boolean', // Так/Ні (наприклад, потрібне пакування)
  NUMBER = 'Number', // Кількісний (наприклад, кількість вантажників, поверхів)
  // Можна додати інші типи за потребою
}
registerEnumType(CargoServiceOptionType, { name: 'CargoServiceOptionType' });

// Оновлені іконки для вантажних опцій
export enum CargoServiceOptionIcon {
  LOADER = 'Loader', // Вантажник
  PACKAGING = 'Packaging', // Пакування
  TAIL_LIFT = 'TailLift', // Гідроборт
  FRIDGE = 'Fridge', // Холодильник
  TOOLS = 'Tools', // Інструменти (наприклад, для збірки меблів)
  // Додати інші за потребою
}
registerEnumType(CargoServiceOptionIcon, { name: 'CargoServiceOptionIcon' });

@ObjectType('ServiceOption') // Назву можна залишити, або змінити на CargoServiceOption
@Authorize(ServiceAuthorizer)
export class ServiceOptionDTO {
  @IDField(() => ID)
  id: number;

  @FilterableField() // Додано можливість фільтрувати за назвою
  name: string; // Наприклад, "Послуги вантажника", "Пакування крихкого", "Підйом на поверх"

  @Field(() => CargoServiceOptionType) // Використовуємо новий Enum
  type: CargoServiceOptionType; // Тип опції (булевий, числовий)

  @Field(() => Float, { nullable: true, description: 'Додаткова плата за опцію (або за одиницю, якщо тип Number)' })
  additionalFee?: number; // Плата за опцію

  @Field(() => CargoServiceOptionIcon) // Використовуємо новий Enum
  icon: CargoServiceOptionIcon; // Іконка для відображення
}