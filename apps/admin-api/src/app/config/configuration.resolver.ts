// apps/admin-api/src/app/config/configuration.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common'; // Import UseGuards
import {
  CurrentConfiguration,
  UpdateConfigResult,
  UpdateConfigStatus,
  UpdatePurchaseCodeResult,
} from '@ridy/database/interfaces/config.dto'; // Adjusted path potentially
import { ConfigurationService } from './configuration.service';
// import { UpdateConfigInput } from './update-config.input'; // Old input
import { LicenseInformationDto } from '@ridy/database/interfaces/license.dto'; // Adjusted path potentially
import { ConfigInformation } from '@ridy/database/interfaces/config-information.dto'; // Adjusted path potentially
import { UpdateConfigInputV2 } from './dto/update-config.input'; // Assuming this is the main config DTO
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import Guard

// NEW: Imports for Settings
import { SettingService } from '@ridy/common/setting/setting.service'; // Adjust path if needed
import { SettingDTO } from './dto/setting.dto';
import { UpdateSettingInput } from './dto/update-setting.input';

@Resolver()
export class ConfigurationResolver {
  constructor(
    private configurationService: ConfigurationService,
    // NEW: Inject SettingService
    private settingService: SettingService
  ) { }

  @Query(() => ConfigInformation)
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async configInformation(): Promise<ConfigInformation> {
    const config = await this.configurationService.getConfiguration();
    return {
      isValid: config.versionNumber != null && config.versionNumber != 1, // Fixed logic
      config,
    };
  }

  @Query(() => LicenseInformationDto, { nullable: true })
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async licenseInformation(): Promise<LicenseInformationDto | null> { // Return type can be null
    return this.configurationService.getLicenseInformation();
  }

  // This mutation updates the main configuration file (config.json likely)
  @Mutation(() => UpdateConfigResult)
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async updateConfigurations(
    @Args('input', { type: () => UpdateConfigInputV2 })
    input: UpdateConfigInputV2,
  ): Promise<UpdateConfigResult> {
    await this.configurationService.updateConfig(input);
    return {
      status: UpdateConfigStatus.OK,
    };
  }

  // This query gets configuration details, potentially sensitive, ensure proper handling
  @Query(() => CurrentConfiguration)
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async currentConfiguration(): Promise<CurrentConfiguration> {
    const currentConfig = await this.configurationService.getConfiguration();
    if (process.env.DEMO_MODE != null) {
      // Mask sensitive data in demo mode
      return {
        ...currentConfig, // Spread other config fields if CurrentConfiguration has them
        purchaseCode: 'RESTRICTED',
        adminPanelAPIKey: 'RESTRICTED',
        firebaseProjectPrivateKey: 'RESTRICTED',
        // Mask other sensitive fields as needed
      };
    }
    return currentConfig;
  }

  @Mutation(() => UpdatePurchaseCodeResult)
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async updatePurchaseCode(
    @Args('purchaseCode', { type: () => String }) purchaseCode: string,
    @Args('email', { type: () => String, nullable: true }) email?: string,
  ): Promise<UpdatePurchaseCodeResult> {
    return this.configurationService.updatePurchaseCode(purchaseCode, email);
  }

  @Mutation(() => UpdateConfigResult)
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async updateMapsAPIKey(
    @Args('backend', { type: () => String }) backend: string,
    @Args('adminPanel', { type: () => String }) adminPanel: string,
  ): Promise<UpdateConfigResult> {
    return this.configurationService.updateMapsAPIKey(backend, adminPanel);
  }

  @Mutation(() => UpdateConfigResult)
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async updateFirebase(
    @Args('keyFileName', { type: () => String }) keyFileName: string,
  ): Promise<UpdateConfigResult> {
    return this.configurationService.updateFirebase(keyFileName);
  }

  @Mutation(() => UpdateConfigResult)
  @UseGuards(JwtAuthGuard) // Protect endpoint
  async disablePreviousServer(
    @Args('ip', { type: () => String }) ip: string,
    @Args('purchaseCode', { type: () => String, nullable: true })
    purchaseCode?: string,
  ): Promise<UpdateConfigResult> {
    return this.configurationService.disablePreviousServer({
      ip,
      purchaseCode,
    });
  }

  // This seems deprecated or conflicting with updateConfigurations, using UpdateConfigInput (old DTO?)
  // @Mutation(() => CurrentConfiguration)
  // @UseGuards(JwtAuthGuard) // Protect endpoint
  // async saveConfiguration(
  //   @Args('input', { type: () => UpdateConfigInput }) // Uses old UpdateConfigInput? Check definition
  //   input: CurrentConfiguration,
  // ) {
  //   return this.configurationService.saveConfiguration(input);
  // }

  // --- NEW Queries/Mutations for SettingEntity ---

  @Query(() => [SettingDTO], { name: 'settings' })
  @UseGuards(JwtAuthGuard)
  async getSettings(): Promise<SettingDTO[]> {
    return this.settingService.getAllSettings();
  }

  @Mutation(() => Boolean, { name: 'updateSettings' })
  @UseGuards(JwtAuthGuard)
  async updateSettings(
    @Args('input', { type: () => [UpdateSettingInput] }) input: UpdateSettingInput[]
  ): Promise<boolean> {
    await this.settingService.updateSettings(input);
    return true;
  }
}

// IMPORTANT: Ensure the module that provides ConfigurationResolver (e.g., ConfigurationModule)
// imports the SettingModule from '@ridy/common/setting/setting.module' (adjust path).