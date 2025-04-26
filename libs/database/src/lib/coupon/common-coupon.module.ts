// libs/database/src/lib/coupon/common-coupon.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Use relative paths for entities within the same library
import { CouponEntity } from '../entities/coupon.entity';
import { RequestEntity } from '../entities/request.entity';
import { GiftCodeEntity } from '../entities/gift-code.entity';
import { RiderEntity } from '../entities/rider-entity';
import { DriverEntity } from '../entities/driver.entity';
import { RiderWalletEntity } from '../entities/rider-wallet.entity';
import { DriverWalletEntity } from '../entities/driver-wallet.entity';
import { RiderTransactionEntity } from '../entities/rider-transaction.entity';
import { DriverTransactionEntity } from '../entities/driver-transaction.entity';

// Keep using path aliases for imports from OTHER libraries
import { SharedRiderService } from '@ridy/order/shared-rider.service'; // Still might fail if path/export is wrong
import { SharedDriverService } from '@ridy/order/shared-driver.service'; // Still might fail if path/export is wrong

import { CommonCouponService } from './common-coupon.service';
import { CommonGiftCardService } from './common-gift-card.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      RiderEntity,
      DriverEntity,
      CouponEntity,
      RiderWalletEntity,
      DriverWalletEntity,
      RiderTransactionEntity,
      DriverTransactionEntity,
      GiftCodeEntity,
    ]),
    // forwardRef(() => OrderModule) // Consider if forwardRef is needed if OrderModule depends on CommonCouponModule
  ],
  providers: [
    CommonCouponService,
    CommonGiftCardService,
    SharedRiderService, // Providing services from another lib here might be problematic
    SharedDriverService, // Consider importing OrderModule instead if possible
  ],
  exports: [CommonCouponService, CommonGiftCardService],
})
export class CommonCouponModule { }