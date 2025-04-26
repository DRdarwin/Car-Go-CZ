// apps/admin-api/src/app/config/dto/setting.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql'; // Assuming you might want filtering later

@ObjectType('Setting')
export class SettingDTO {
    @FilterableField({ description: 'Unique key for the setting' })
    key!: string;

    @Field({ description: 'Value of the setting (stored as string)' })
    value!: string;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    group?: string;

    @Field({ nullable: true })
    isPublic?: boolean;
}