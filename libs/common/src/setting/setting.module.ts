// libs/common/src/setting/setting.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingEntity } from '@ridy/database';
import { SettingService } from './setting.service';

@Module({
    imports: [TypeOrmModule.forFeature([SettingEntity])],
    providers: [SettingService],
    exports: [SettingService], // Export service to be used in other modules
})
export class SettingModule { }