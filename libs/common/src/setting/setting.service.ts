// libs/common/src/setting/setting.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingEntity } from '@ridy/database'; // Adjust path if needed
import { Repository } from 'typeorm';

export const LOADER_COST_PER_HOUR_KEY = 'loader_cost_per_hour'; // Define key constant

@Injectable()
export class SettingService {
    private readonly logger = new Logger(SettingService.name);

    constructor(
        @InjectRepository(SettingEntity)
        private readonly settingRepository: Repository<SettingEntity>,
    ) { }

    async getSetting(key: string): Promise<SettingEntity | null> {
        return this.settingRepository.findOneBy({ key });
    }

    async getAllSettings(): Promise<SettingEntity[]> { // NEW METHOD
        return this.settingRepository.find({ order: { group: 'ASC', key: 'ASC' } }); // Optional ordering
    }

    async getString(key: string, defaultValue?: string): Promise<string | undefined> {
        try {
            const setting = await this.getSetting(key);
            return setting?.value ?? defaultValue;
        } catch (error) {
            this.logger.error(`Error fetching string setting for key: ${key}`, error);
            return defaultValue;
        }
    }

    async getNumber(key: string, defaultValue?: number): Promise<number | undefined> {
        try {
            const setting = await this.getSetting(key);
            if (setting?.value) {
                const parsedValue = parseFloat(setting.value);
                if (!isNaN(parsedValue)) {
                    return parsedValue;
                } else {
                    this.logger.warn(`Invalid number format for setting key: ${key}. Value: ${setting.value}`);
                }
            }
            return defaultValue;
        } catch (error) {
            this.logger.error(`Error fetching number setting for key: ${key}`, error);
            return defaultValue;
        }
    }

    async getBoolean(key: string, defaultValue?: boolean): Promise<boolean | undefined> {
        try {
            const setting = await this.getSetting(key);
            if (setting?.value) {
                return setting.value.toLowerCase() === 'true';
            }
            return defaultValue;
        } catch (error) {
            this.logger.error(`Error fetching boolean setting for key: ${key}`, error);
            return defaultValue;
        }
    }

    async getLoaderCostPerHour(): Promise<number> {
        const cost = await this.getNumber(LOADER_COST_PER_HOUR_KEY, 0);
        if (cost === 0) {
            this.logger.warn(`Setting key '${LOADER_COST_PER_HOUR_KEY}' not found or is zero. Loaders will be free.`);
        }
        return cost ?? 0;
    }

    async updateSetting(key: string, value: string): Promise<SettingEntity> {
        const setting = this.settingRepository.create({ key, value });
        return this.settingRepository.save(setting);
    }

    async updateSettings(settings: Array<{ key: string; value: string }>): Promise<SettingEntity[]> {
        const entities = settings.map(s => this.settingRepository.create(s));
        // Use save with chunking if the number of settings can be very large
        return this.settingRepository.save(entities);
    }
}