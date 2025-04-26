// admin-api/src/app/order/dto/create-order.input.ts
import { Field, Float, ID, InputType, Int } from "@nestjs/graphql"; // Додано Float
import { Point } from "@ridy/database";

// Допоміжний тип для передачі обраних опцій
@InputType('SelectedOrderOptionInput')
export class SelectedOrderOptionInput {
  @Field(() => ID)
  optionId!: number;

  @Field(() => Int, { nullable: true, description: 'Кількість (напр., вантажників)' })
  quantity?: number;
}


@InputType()
export class CreateOrderInput {
    @Field(() => ID)
    riderId: number; // Замовник

    @Field(() => ID)
    serviceId!: number; // Обрана послуга (тип вантажівки/тариф)

    @Field(() => [Point])
    points!: Point[]; // Координати маршруту

    @Field(() => [String])
    addresses!: string[]; // Адреси маршруту

    @Field(() => Int, { description: 'Час, на який потрібно подати авто (хвилини від поточного, 0 - зараз)' })
    intervalMinutes!: number;

    // --- Дані Вантажу (опціонально при створенні диспетчером) ---
    @Field({ nullable: true, description: 'Опис вантажу' })
    cargoDescription?: string;

    @Field(() => Float, { nullable: true, description: 'Орієнтовна вага вантажу (кг)' })
    cargoWeightKg?: number;

    @Field(() => Float, { nullable: true, description: 'Орієнтовний об\'єм вантажу (м³)' })
    cargoVolumeM3?: number;

    @Field(() => Int, { nullable: true, description: 'Поверх в точці завантаження' })
    pickupFloors?: number;

    @Field(() => Int, { nullable: true, description: 'Поверх в точці розвантаження' })
    dropoffFloors?: number;

    // --- Опції ---
    @Field(() => [SelectedOrderOptionInput], { nullable: true, description: 'Обрані додаткові опції' })
    selectedOptionsInput?: SelectedOrderOptionInput[];

    // --- Опціональний час роботи (оцінка диспетчера) ---
    @Field(() => Int, { nullable: true, description: 'Орієнтовний час роботи в точці завантаження (хвилини)' })
    estimatedPickupWorkTimeMinutes?: number;

    @Field(() => Int, { nullable: true, description: 'Орієнтовний час роботи в точці розвантаження (хвилини)' })
    estimatedDropoffWorkTimeMinutes?: number;

    // Поле waitMinutes з пасажирського таксі; видалено, використовуємо *WorkTimeMinutes
    // waitMinutes: number;
}