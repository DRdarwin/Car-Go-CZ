// apps/admin-api/src/app/config/dto/update-setting.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateSettingInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    key!: string;

    @Field()
    @IsNotEmpty() // Value can be empty string, but key must exist
    @IsString()
    value!: string;
}