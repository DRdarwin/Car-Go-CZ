/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var AdminAPIModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminAPIModule = void 0;
const tslib_1 = __webpack_require__(1);
const apollo_1 = __webpack_require__(5);
const axios_1 = __webpack_require__(6);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(8);
const database_1 = __webpack_require__(9);
const geo_module_1 = __webpack_require__(115);
const nestjs_redis_1 = __webpack_require__(125);
const axios_2 = tslib_1.__importDefault(__webpack_require__(126));
const fs_1 = __webpack_require__(122);
const path_1 = __webpack_require__(127);
const accounting_module_1 = __webpack_require__(128);
const address_module_1 = __webpack_require__(183);
const admin_api_setup_not_found_controller_1 = __webpack_require__(185);
const admin_api_controller_1 = __webpack_require__(186);
const announcement_module_1 = __webpack_require__(195);
const auth_module_1 = __webpack_require__(199);
const jwt_strategy_1 = __webpack_require__(210);
const car_module_1 = __webpack_require__(213);
const complaint_module_1 = __webpack_require__(219);
const configuration_module_1 = __webpack_require__(221);
const coupon_module_1 = __webpack_require__(234);
const driver_module_1 = __webpack_require__(236);
const feedback_module_1 = __webpack_require__(247);
const fleet_module_1 = __webpack_require__(249);
const gift_card_module_1 = __webpack_require__(257);
const operator_module_1 = __webpack_require__(201);
const order_module_1 = __webpack_require__(265);
const payment_gateway_module_1 = __webpack_require__(276);
const payout_module_1 = __webpack_require__(278);
const region_module_1 = __webpack_require__(289);
const reward_module_1 = __webpack_require__(291);
const rider_module_1 = __webpack_require__(293);
const service_module_1 = __webpack_require__(297);
const sms_provider_module_1 = __webpack_require__(308);
const sos_module_1 = __webpack_require__(315);
const upload_module_1 = __webpack_require__(321);
const upload_service_1 = __webpack_require__(190);
let AdminAPIModule = AdminAPIModule_1 = class AdminAPIModule {
    static async register() {
        const configAddress = `${process.cwd()}/config/config.${process.env.NODE_ENV ?? 'production'}.json`;
        common_1.Logger.log(`Config address: ${configAddress}`);
        if ((0, fs_1.existsSync)(configAddress)) {
            const file = await fs_1.promises.readFile(configAddress, { encoding: 'utf-8' });
            const config = JSON.parse(file);
            const firebaseKeyFileAddress = `${process.cwd()}/config/${config.firebaseProjectPrivateKey}`;
            if (config.firebaseProjectPrivateKey != null &&
                (0, fs_1.existsSync)(firebaseKeyFileAddress)) {
                const verResult = await axios_2.default.get(`http://31.220.15.49:9000/verify?purchaseCode=${config.purchaseCode}&port=${process.env.ADMIN_API_PORT || 3000}`);
                common_1.Logger.log(verResult.data, 'Verification');
                if (verResult.data.status == 'FAILED') {
                    common_1.Logger.error(verResult.data.message, 'Verification');
                    return {
                        module: AdminAPIModule_1,
                        imports: [
                            axios_1.HttpModule,
                            graphql_1.GraphQLModule.forRoot({
                                driver: apollo_1.ApolloDriver,
                                autoSchemaFile: true,
                                // cors: false,
                                //uploads: false,
                            }),
                            configuration_module_1.ConfigurationModule,
                        ],
                        controllers: [admin_api_setup_not_found_controller_1.AdminApiSetupNotFoundController],
                    };
                }
                global.saltKey = verResult.data.token;
                global.license = verResult.data.data;
                return {
                    module: AdminAPIModule_1,
                    imports: [
                        database_1.DatabaseModule,
                        graphql_1.GraphQLModule.forRoot({
                            driver: apollo_1.ApolloDriver,
                            context: ({ req, res, extra }) => {
                                return extra && extra.user
                                    ? {
                                        req: req,
                                        res: res,
                                        user: extra.user,
                                    }
                                    : { req: req, res: res };
                            },
                            subscriptions: {
                                'graphql-ws': {
                                    //keepAlive: 5000,
                                    onConnect: async (context) => {
                                        const { connectionParams, extra } = context;
                                        if (connectionParams.authToken) {
                                            common_1.Logger.log(`connection established with token ${connectionParams.authToken}`, 'GraphQL');
                                            const userObject = await (0, jwt_strategy_1.validateToken)(connectionParams.authToken);
                                            common_1.Logger.log(`userObject: ${JSON.stringify(userObject)}`, 'GraphQL');
                                            extra['user'] = userObject;
                                            return;
                                        }
                                        throw new Error('Missing auth token!');
                                    },
                                    onDisconnect: () => {
                                        common_1.Logger.log('connection disconnected', 'GraphQL');
                                    },
                                    onSubscribe: () => {
                                        common_1.Logger.log(`subscription started`, 'GraphQL');
                                    },
                                },
                            },
                            autoSchemaFile: (0, path_1.join)(process.cwd(), 'admin.schema.gql'),
                            // cors: false,
                        }),
                        typeorm_1.TypeOrmModule.forFeature(database_1.entities),
                        service_module_1.ServiceModule,
                        operator_module_1.OperatorModule,
                        rider_module_1.RiderModule,
                        driver_module_1.DriverModule,
                        fleet_module_1.FleetModule,
                        order_module_1.OrderModule,
                        announcement_module_1.AnnouncementModule,
                        coupon_module_1.CouponModule,
                        gift_card_module_1.GiftCardModule,
                        accounting_module_1.AccountingModule,
                        region_module_1.RegionModule,
                        payment_gateway_module_1.PaymentGatewayModule,
                        car_module_1.CarModule,
                        feedback_module_1.FeedbackModule,
                        address_module_1.AddressModule,
                        auth_module_1.AuthModule,
                        payout_module_1.PayoutModule,
                        upload_module_1.UploadModule,
                        sos_module_1.SOSModule,
                        reward_module_1.RewardModule,
                        complaint_module_1.ComplaintModule,
                        geo_module_1.GeoModule,
                        configuration_module_1.ConfigurationModule,
                        axios_1.HttpModule,
                        sms_provider_module_1.SMSProviderModule,
                        nestjs_redis_1.RedisModule.forRoot({
                            closeClient: true,
                            commonOptions: { db: 2 },
                            config: {
                                host: process.env.REDIS_HOST ?? 'localhost',
                            },
                        }),
                    ],
                    providers: [upload_service_1.UploadService],
                    controllers: [admin_api_controller_1.AppController],
                };
            }
        }
        return {
            module: AdminAPIModule_1,
            imports: [
                axios_1.HttpModule,
                graphql_1.GraphQLModule.forRoot({
                    driver: apollo_1.ApolloDriver,
                    autoSchemaFile: true,
                    // cors: false,
                    //uploads: false,
                }),
                configuration_module_1.ConfigurationModule,
            ],
            controllers: [admin_api_setup_not_found_controller_1.AdminApiSetupNotFoundController],
        };
    }
};
exports.AdminAPIModule = AdminAPIModule;
exports.AdminAPIModule = AdminAPIModule = AdminAPIModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], AdminAPIModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// libs/database/src/index.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
// --- Modules ---
tslib_1.__exportStar(__webpack_require__(10), exports);
// --- Core Interfaces / Services ---
tslib_1.__exportStar(__webpack_require__(72), exports);
tslib_1.__exportStar(__webpack_require__(103), exports);
tslib_1.__exportStar(__webpack_require__(107), exports);
// --- Enums ---
tslib_1.__exportStar(__webpack_require__(77), exports);
tslib_1.__exportStar(__webpack_require__(96), exports);
tslib_1.__exportStar(__webpack_require__(89), exports);
tslib_1.__exportStar(__webpack_require__(90), exports);
tslib_1.__exportStar(__webpack_require__(27), exports); // Needed by driver-location.dto.ts
tslib_1.__exportStar(__webpack_require__(15), exports); // Needed by driver-transaction.dto/input.ts
tslib_1.__exportStar(__webpack_require__(16), exports); // Needed by driver-transaction.dto/input.ts
tslib_1.__exportStar(__webpack_require__(17), exports); // Needed by driver-transaction.dto/input.ts
tslib_1.__exportStar(__webpack_require__(18), exports); // Needed by driver-transaction.dto.ts
// Add other enums exported previously if needed by other parts of the app...
tslib_1.__exportStar(__webpack_require__(56), exports); // Needed by ServiceEntity / ServiceInput
// --- Interfaces ---
tslib_1.__exportStar(__webpack_require__(109), exports); // Corrected path for the interface
tslib_1.__exportStar(__webpack_require__(110), exports);
tslib_1.__exportStar(__webpack_require__(111), exports);
tslib_1.__exportStar(__webpack_require__(112), exports);
tslib_1.__exportStar(__webpack_require__(113), exports);
// --- Entities ---
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(52), exports);
tslib_1.__exportStar(__webpack_require__(13), exports);
tslib_1.__exportStar(__webpack_require__(97), exports);
tslib_1.__exportStar(__webpack_require__(114), exports);
tslib_1.__exportStar(__webpack_require__(26), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(64), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(60), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);
tslib_1.__exportStar(__webpack_require__(44), exports);
tslib_1.__exportStar(__webpack_require__(80), exports);
tslib_1.__exportStar(__webpack_require__(82), exports);
tslib_1.__exportStar(__webpack_require__(88), exports);
tslib_1.__exportStar(__webpack_require__(34), exports);
tslib_1.__exportStar(__webpack_require__(14), exports); // Needed for DTO
tslib_1.__exportStar(__webpack_require__(67), exports);
tslib_1.__exportStar(__webpack_require__(40), exports);
tslib_1.__exportStar(__webpack_require__(78), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(84), exports);
tslib_1.__exportStar(__webpack_require__(19), exports);
// --- Transformers ---
tslib_1.__exportStar(__webpack_require__(53), exports);
tslib_1.__exportStar(__webpack_require__(54), exports);
tslib_1.__exportStar(__webpack_require__(69), exports);
tslib_1.__exportStar(__webpack_require__(70), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.entities = exports.DatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(11);
const car_color_entity_1 = __webpack_require__(12);
const car_model_entity_1 = __webpack_require__(98);
const complaint_activity_entity_1 = __webpack_require__(20);
const complaint_entity_1 = __webpack_require__(21);
const coupon_entity_1 = __webpack_require__(25);
const driver_transaction_entity_1 = __webpack_require__(14);
const driver_wallet_entity_1 = __webpack_require__(95);
const driver_entity_1 = __webpack_require__(13);
const feedback_parameter_entity_1 = __webpack_require__(79);
const feedback_entity_1 = __webpack_require__(78);
const fleet_transaction_entity_1 = __webpack_require__(67);
const fleet_wallet_entity_1 = __webpack_require__(68);
const fleet_entity_1 = __webpack_require__(64);
const media_entity_1 = __webpack_require__(30);
const operator_role_entity_1 = __webpack_require__(93);
const operator_entity_1 = __webpack_require__(19);
const request_message_entity_1 = __webpack_require__(80);
const request_entity_1 = __webpack_require__(23);
const payment_gateway_entity_1 = __webpack_require__(33);
const provider_transaction_entity_1 = __webpack_require__(40);
const provider_wallet_entity_1 = __webpack_require__(99);
const region_entity_1 = __webpack_require__(57);
const rider_address_entity_1 = __webpack_require__(71);
const rider_entity_1 = __webpack_require__(26);
const rider_transaction_entity_1 = __webpack_require__(34);
const rider_wallet_entity_1 = __webpack_require__(75);
const service_category_entity_1 = __webpack_require__(59);
const service_entity_1 = __webpack_require__(52);
const payment_entity_1 = __webpack_require__(100);
const service_option_entity_1 = __webpack_require__(60);
const gift_code_entity_1 = __webpack_require__(37);
const gift_batch_entity_1 = __webpack_require__(38);
const sos_entity_1 = __webpack_require__(84);
const sos_activity_entity_1 = __webpack_require__(86);
const announcement_entity_1 = __webpack_require__(31);
const zone_price_entity_1 = __webpack_require__(63);
const gateway_to_user_entity_1 = __webpack_require__(43);
const fleet_device_entity_1 = __webpack_require__(65);
const order_cancel_reason_entity_1 = __webpack_require__(88);
const saved_payment_method_entity_1 = __webpack_require__(44);
const rider_review_entity_1 = __webpack_require__(76);
const payout_account_entity_1 = __webpack_require__(47);
const payout_method_entity_1 = __webpack_require__(48);
const payout_session_entity_1 = __webpack_require__(50);
let DatabaseModule = class DatabaseModule {
    async onModuleInit() {
        common_1.Logger.log('Module init started');
        const conn = await (0, typeorm_2.createConnection)({
            name: 'mg',
            type: 'mysql',
            host: process.env.MYSQL_HOST || 'localhost',
            port: 3306,
            username: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASS || 'defaultpassword',
            database: process.env.MYSQL_DB || 'ridy',
            migrations: [`${__dirname}/migration/*.js`],
            migrationsRun: true,
            logging: true,
        });
        const migrationsOutput = await conn.runMigrations();
        common_1.Logger.log('Module init finished.');
        common_1.Logger.log(`${migrationsOutput.length} Migrations done!`);
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: async () => {
                    common_1.Logger.log('TypeORM import started');
                    const dbName = process.env.MYSQL_DB || 'ridy';
                    const baseConn = {
                        type: 'mysql',
                        host: process.env.MYSQL_HOST || 'localhost',
                        port: 3306,
                        username: process.env.MYSQL_USER || 'root',
                        password: process.env.MYSQL_PASS || 'defaultpassword',
                    };
                    const conn = await (0, typeorm_2.createConnection)({ ...baseConn, name: 'ts' });
                    const databases = await conn.query(`SHOW DATABASES LIKE '${dbName}';`);
                    let shouldSync = databases.length < 1 ||
                        process.env.FORCE_SYNC_DB != null;
                    if (shouldSync) {
                        await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
                    }
                    //conn.query(`USE ${dbName}`);
                    const tables = await conn.query(`SHOW TABLES FROM ${dbName};`);
                    shouldSync =
                        tables.length < 5 || process.env.FORCE_SYNC_DB != null;
                    common_1.Logger.log('type orm import finished');
                    return {
                        ...baseConn,
                        database: dbName,
                        autoLoadEntities: true,
                        legacySpatialSupport: false,
                        migrations: [`${__dirname}/migration/*.js`],
                        synchronize: shouldSync,
                        migrationsRun: false,
                        logging: true,
                    };
                },
            }),
        ],
        controllers: [],
        providers: [],
        exports: [],
    })
], DatabaseModule);
exports.entities = [
    media_entity_1.MediaEntity,
    operator_entity_1.OperatorEntity,
    operator_role_entity_1.OperatorRoleEntity,
    driver_entity_1.DriverEntity,
    provider_transaction_entity_1.ProviderTransactionEntity,
    provider_wallet_entity_1.ProviderWalletEntity,
    complaint_activity_entity_1.ComplaintActivityEntity,
    complaint_entity_1.ComplaintEntity,
    car_model_entity_1.CarModelEntity,
    car_color_entity_1.CarColorEntity,
    driver_transaction_entity_1.DriverTransactionEntity,
    driver_wallet_entity_1.DriverWalletEntity,
    feedback_parameter_entity_1.FeedbackParameterEntity,
    feedback_entity_1.FeedbackEntity,
    fleet_entity_1.FleetEntity,
    fleet_wallet_entity_1.FleetWalletEntity,
    fleet_transaction_entity_1.FleetTransactionEntity,
    fleet_device_entity_1.FleetDeviceEntity,
    request_entity_1.RequestEntity,
    request_message_entity_1.OrderMessageEntity,
    order_cancel_reason_entity_1.OrderCancelReasonEntity,
    payment_gateway_entity_1.PaymentGatewayEntity,
    payment_entity_1.PaymentEntity,
    service_entity_1.ServiceEntity,
    service_category_entity_1.ServiceCategoryEntity,
    coupon_entity_1.CouponEntity,
    region_entity_1.RegionEntity,
    rider_entity_1.RiderEntity,
    rider_wallet_entity_1.RiderWalletEntity,
    rider_transaction_entity_1.RiderTransactionEntity,
    rider_address_entity_1.RiderAddressEntity,
    service_option_entity_1.ServiceOptionEntity,
    gift_batch_entity_1.GiftBatchEntity,
    gift_code_entity_1.GiftCodeEntity,
    sos_entity_1.SOSEntity,
    sos_activity_entity_1.SOSActivityEntity,
    announcement_entity_1.AnnouncementEntity,
    zone_price_entity_1.ZonePriceEntity,
    gateway_to_user_entity_1.GatewayToUserEntity,
    saved_payment_method_entity_1.SavedPaymentMethodEntity,
    rider_review_entity_1.RiderReviewEntity,
    payout_method_entity_1.PayoutMethodEntity,
    payout_account_entity_1.PayoutAccountEntity,
    payout_session_entity_1.PayoutSessionEntity,
];


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarColorEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_entity_1 = __webpack_require__(13);
let CarColorEntity = class CarColorEntity {
};
exports.CarColorEntity = CarColorEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], CarColorEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], CarColorEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_entity_1.DriverEntity, driver => driver.carColor),
    tslib_1.__metadata("design:type", Array)
], CarColorEntity.prototype, "drivers", void 0);
exports.CarColorEntity = CarColorEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('car_color')
], CarColorEntity);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverEntity = void 0;
const tslib_1 = __webpack_require__(1);
// libs/database/src/lib/entities/driver.entity.ts
const typeorm_1 = __webpack_require__(11);
// REMOVED: Imports for CarColorEntity, CarModelEntity
// import { CarColorEntity } from './car-color.entity';
// import { CarModelEntity } from './car-model.entity';
const driver_transaction_entity_1 = __webpack_require__(14);
const driver_wallet_entity_1 = __webpack_require__(95);
const driver_status_enum_1 = __webpack_require__(96);
const gender_enum_1 = __webpack_require__(27);
const feedback_entity_1 = __webpack_require__(78);
const fleet_transaction_entity_1 = __webpack_require__(67);
const fleet_entity_1 = __webpack_require__(64);
const media_entity_1 = __webpack_require__(30);
const request_entity_1 = __webpack_require__(23);
const service_entity_1 = __webpack_require__(52);
const saved_payment_method_entity_1 = __webpack_require__(44);
const rider_review_entity_1 = __webpack_require__(76);
const rider_entity_1 = __webpack_require__(26);
const payout_account_entity_1 = __webpack_require__(47);
const vehicle_entity_1 = __webpack_require__(97); // NEW: Import VehicleEntity
let DriverEntity = class DriverEntity {
};
exports.DriverEntity = DriverEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 5 }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "countryIso", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('bigint', {
        unique: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "certificateNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => vehicle_entity_1.VehicleEntity, vehicle => vehicle.driver, { cascade: true, eager: true, nullable: true }) // Eager load vehicle info? Optional. nullable:true means driver might not have a vehicle assigned yet.
    ,
    (0, typeorm_1.JoinColumn)() // Driver entity holds the foreign key (vehicleId)
    ,
    tslib_1.__metadata("design:type", vehicle_entity_1.VehicleEntity)
], DriverEntity.prototype, "vehicle", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }) // Foreign key column
    ,
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "vehicleId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "searchDistance", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        default: driver_status_enum_1.DriverStatus.WaitingDocuments,
        enum: driver_status_enum_1.DriverStatus,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        nullable: true,
        enum: gender_enum_1.Gender,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], DriverEntity.prototype, "registrationTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('smallint', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "reviewCount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Date)
], DriverEntity.prototype, "lastSeenTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => rider_entity_1.RiderEntity, (rider) => rider.favoriteDrivers),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "ridersFavorited", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => rider_entity_1.RiderEntity, (rider) => rider.blockedDrivers),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "ridersBlocked", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => media_entity_1.MediaEntity, (media) => media.uploadedByDriver),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "uploads", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.ServiceEntity, (service) => service.drivers),
    (0, typeorm_1.JoinTable)({ name: 'driver_services_service' }),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "enabledServices", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => media_entity_1.MediaEntity, (media) => media.driverDocument),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "documents", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "accountNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "bankName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "bankRoutingNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "bankSwift", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "address", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "notificationPlayerId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'documentsNote' }),
    tslib_1.__metadata("design:type", String)
], DriverEntity.prototype, "softRejectionNote", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], DriverEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, (media) => media.driver),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], DriverEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "mediaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', {
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "presetAvatarNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => payout_account_entity_1.PayoutAccountEntity, (payoutAccount) => payoutAccount.driver),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "payoutAccounts", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.FeedbackEntity, (feedback) => feedback.driver),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "feedbacks", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => fleet_entity_1.FleetEntity, (fleet) => fleet.drivers),
    tslib_1.__metadata("design:type", fleet_entity_1.FleetEntity)
], DriverEntity.prototype, "fleet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverEntity.prototype, "fleetId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_wallet_entity_1.DriverWalletEntity, (wallet) => wallet.driver),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "wallet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_transaction_entity_1.DriverTransactionEntity, (driverTransaction) => driverTransaction.driver, { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "transactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (order) => order.driver, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => fleet_transaction_entity_1.FleetTransactionEntity, (fleetTransaction) => fleetTransaction.driver),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "fleetTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => saved_payment_method_entity_1.SavedPaymentMethodEntity, (savedPaymentMethod) => savedPaymentMethod.driver),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "savedPaymentMethods", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_review_entity_1.RiderReviewEntity, (review) => review.driver),
    tslib_1.__metadata("design:type", Array)
], DriverEntity.prototype, "reviewsByDriver", void 0);
exports.DriverEntity = DriverEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('driver')
], DriverEntity);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverTransactionEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_entity_1 = __webpack_require__(13);
const driver_deduct_transaction_type_enum_1 = __webpack_require__(15);
const driver_recharge_transaction_type_enum_1 = __webpack_require__(16);
const transaction_action_enum_1 = __webpack_require__(17);
const transaction_status_enum_1 = __webpack_require__(18);
const operator_entity_1 = __webpack_require__(19);
const request_entity_1 = __webpack_require__(23);
const payment_gateway_entity_1 = __webpack_require__(33);
const gift_code_entity_1 = __webpack_require__(37);
const payout_session_entity_1 = __webpack_require__(50);
const payout_account_entity_1 = __webpack_require__(47);
const payout_method_entity_1 = __webpack_require__(48);
let DriverTransactionEntity = class DriverTransactionEntity {
};
exports.DriverTransactionEntity = DriverTransactionEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'transactionTime' }),
    tslib_1.__metadata("design:type", Date)
], DriverTransactionEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: transaction_status_enum_1.TransactionStatus,
        default: transaction_status_enum_1.TransactionStatus.Processing,
    }),
    tslib_1.__metadata("design:type", String)
], DriverTransactionEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', { enum: transaction_action_enum_1.TransactionAction }),
    tslib_1.__metadata("design:type", String)
], DriverTransactionEntity.prototype, "action", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: driver_deduct_transaction_type_enum_1.DriverDeductTransactionType,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverTransactionEntity.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: driver_recharge_transaction_type_enum_1.DriverRechargeTransactionType,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], DriverTransactionEntity.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: '3' }),
    tslib_1.__metadata("design:type", String)
], DriverTransactionEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'documentNumber' }),
    tslib_1.__metadata("design:type", String)
], DriverTransactionEntity.prototype, "refrenceNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'details' }),
    tslib_1.__metadata("design:type", String)
], DriverTransactionEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.transactions),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], DriverTransactionEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, (gateway) => gateway.riderTransactions),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], DriverTransactionEntity.prototype, "paymentGateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "paymentGatewayId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, (operator) => operator.driverTransactions),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], DriverTransactionEntity.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, (order) => order.driverTransactions),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], DriverTransactionEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => gift_code_entity_1.GiftCodeEntity, (giftCard) => giftCard.riderTransaction),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", gift_code_entity_1.GiftCodeEntity)
], DriverTransactionEntity.prototype, "giftCard", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "giftCardId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payout_session_entity_1.PayoutSessionEntity, (session) => session.driverTransactions),
    tslib_1.__metadata("design:type", payout_session_entity_1.PayoutSessionEntity)
], DriverTransactionEntity.prototype, "payoutSession", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "payoutSessionId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payout_account_entity_1.PayoutAccountEntity, (payoutAccount) => payoutAccount.driverTransactions),
    tslib_1.__metadata("design:type", payout_account_entity_1.PayoutAccountEntity)
], DriverTransactionEntity.prototype, "payoutAccount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "payoutAccountId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payout_method_entity_1.PayoutMethodEntity, (payoutMethod) => payoutMethod.driverTransactions),
    tslib_1.__metadata("design:type", payout_method_entity_1.PayoutMethodEntity)
], DriverTransactionEntity.prototype, "payoutMethod", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionEntity.prototype, "payoutMethodId", void 0);
exports.DriverTransactionEntity = DriverTransactionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('driver_transaction')
], DriverTransactionEntity);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverDeductTransactionType = void 0;
const graphql_1 = __webpack_require__(7);
var DriverDeductTransactionType;
(function (DriverDeductTransactionType) {
    DriverDeductTransactionType["Withdraw"] = "Withdraw";
    DriverDeductTransactionType["Commission"] = "Commission";
    DriverDeductTransactionType["Correction"] = "Correction";
})(DriverDeductTransactionType || (exports.DriverDeductTransactionType = DriverDeductTransactionType = {}));
(0, graphql_1.registerEnumType)(DriverDeductTransactionType, { name: 'DriverDeductTransactionType' });


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverRechargeTransactionType = void 0;
const graphql_1 = __webpack_require__(7);
var DriverRechargeTransactionType;
(function (DriverRechargeTransactionType) {
    DriverRechargeTransactionType["OrderFee"] = "OrderFee";
    DriverRechargeTransactionType["BankTransfer"] = "BankTransfer";
    DriverRechargeTransactionType["InAppPayment"] = "InAppPayment";
    DriverRechargeTransactionType["Gift"] = "Gift";
})(DriverRechargeTransactionType || (exports.DriverRechargeTransactionType = DriverRechargeTransactionType = {}));
(0, graphql_1.registerEnumType)(DriverRechargeTransactionType, { name: 'DriverRechargeTransactionType' });


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionAction = void 0;
const graphql_1 = __webpack_require__(7);
var TransactionAction;
(function (TransactionAction) {
    TransactionAction["Recharge"] = "Recharge";
    TransactionAction["Deduct"] = "Deduct";
})(TransactionAction || (exports.TransactionAction = TransactionAction = {}));
(0, graphql_1.registerEnumType)(TransactionAction, { name: 'TransactionAction' });


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionStatus = void 0;
const graphql_1 = __webpack_require__(7);
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["Processing"] = "Processing";
    TransactionStatus["Done"] = "Done";
    TransactionStatus["Canceled"] = "Canceled";
    TransactionStatus["Rejected"] = "Rejected";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
(0, graphql_1.registerEnumType)(TransactionStatus, { name: 'TransactionStatus' });


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const complaint_activity_entity_1 = __webpack_require__(20);
const driver_transaction_entity_1 = __webpack_require__(14);
const enabled_notification_enum_1 = __webpack_require__(92);
const fleet_transaction_entity_1 = __webpack_require__(67);
const fleet_entity_1 = __webpack_require__(64);
const media_entity_1 = __webpack_require__(30);
const operator_role_entity_1 = __webpack_require__(93);
const provider_transaction_entity_1 = __webpack_require__(40);
const request_entity_1 = __webpack_require__(23);
const rider_transaction_entity_1 = __webpack_require__(34);
const sos_activity_entity_1 = __webpack_require__(86);
const payout_session_entity_1 = __webpack_require__(50);
const gift_batch_entity_1 = __webpack_require__(38);
let OperatorEntity = class OperatorEntity {
};
exports.OperatorEntity = OperatorEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], OperatorEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OperatorEntity.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OperatorEntity.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], OperatorEntity.prototype, "userName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: 'admin' }),
    tslib_1.__metadata("design:type", String)
], OperatorEntity.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('bigint', {
        nullable: true,
        unique: true,
    }),
    tslib_1.__metadata("design:type", String)
], OperatorEntity.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('set', {
        enum: enabled_notification_enum_1.EnabledNotification,
        default: [
            enabled_notification_enum_1.EnabledNotification.Complaint,
            enabled_notification_enum_1.EnabledNotification.SOS,
            enabled_notification_enum_1.EnabledNotification.DriverSubmittedDocs,
        ],
    }),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "enabledNotifications", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OperatorEntity.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OperatorEntity.prototype, "address", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, (media) => media.operator),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], OperatorEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OperatorEntity.prototype, "mediaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_role_entity_1.OperatorRoleEntity, (role) => role.operators),
    tslib_1.__metadata("design:type", operator_role_entity_1.OperatorRoleEntity)
], OperatorEntity.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OperatorEntity.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => fleet_entity_1.FleetEntity, (fleet) => fleet.operators),
    tslib_1.__metadata("design:type", fleet_entity_1.FleetEntity)
], OperatorEntity.prototype, "fleet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (request) => request.operator, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    }),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "requests", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => complaint_activity_entity_1.ComplaintActivityEntity, (activity) => activity.actor),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "complaintActivities", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_transaction_entity_1.RiderTransactionEntity, (riderTransaction) => riderTransaction.operator),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "riderTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_transaction_entity_1.DriverTransactionEntity, (driverTransaction) => driverTransaction.operator),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "driverTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => fleet_transaction_entity_1.FleetTransactionEntity, (fleetTransaction) => fleetTransaction.operator),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "fleetTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => provider_transaction_entity_1.ProviderTransactionEntity, (providerTransaction) => providerTransaction.operator),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "providerTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => sos_activity_entity_1.SOSActivityEntity, (sosActivity) => sosActivity.operator),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "sosActivities", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => payout_session_entity_1.PayoutSessionEntity, (payoutSession) => payoutSession.createdByOperator),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "payoutSessionsCreated", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => gift_batch_entity_1.GiftBatchEntity, (gift) => gift.createdByOperator),
    tslib_1.__metadata("design:type", Array)
], OperatorEntity.prototype, "giftBatchesCreated", void 0);
exports.OperatorEntity = OperatorEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('operator')
], OperatorEntity);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintActivityEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const complaint_entity_1 = __webpack_require__(21);
const complaint_activity_type_enum_1 = __webpack_require__(91);
const operator_entity_1 = __webpack_require__(19);
let ComplaintActivityEntity = class ComplaintActivityEntity {
};
exports.ComplaintActivityEntity = ComplaintActivityEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ComplaintActivityEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: complaint_activity_type_enum_1.ComplaintActivityType
    }),
    tslib_1.__metadata("design:type", String)
], ComplaintActivityEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, operator => operator.complaintActivities),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], ComplaintActivityEntity.prototype, "actor", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], ComplaintActivityEntity.prototype, "assignedTo", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ComplaintActivityEntity.prototype, "assignedToId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ComplaintActivityEntity.prototype, "comment", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => complaint_entity_1.ComplaintEntity, complaint => complaint.activities),
    tslib_1.__metadata("design:type", complaint_entity_1.ComplaintEntity)
], ComplaintActivityEntity.prototype, "complaint", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], ComplaintActivityEntity.prototype, "complaintId", void 0);
exports.ComplaintActivityEntity = ComplaintActivityEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('complaint_activity')
], ComplaintActivityEntity);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const complaint_activity_entity_1 = __webpack_require__(20);
const complaint_status_enum_1 = __webpack_require__(22);
const request_entity_1 = __webpack_require__(23);
let ComplaintEntity = class ComplaintEntity {
};
exports.ComplaintEntity = ComplaintEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ComplaintEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], ComplaintEntity.prototype, "inscriptionTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, order => order.complaints),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], ComplaintEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], ComplaintEntity.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], ComplaintEntity.prototype, "requestedByDriver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], ComplaintEntity.prototype, "subject", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ComplaintEntity.prototype, "content", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: complaint_status_enum_1.ComplaintStatus,
        default: complaint_status_enum_1.ComplaintStatus.Submitted
    }),
    tslib_1.__metadata("design:type", String)
], ComplaintEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => complaint_activity_entity_1.ComplaintActivityEntity, activity => activity.complaint),
    tslib_1.__metadata("design:type", Array)
], ComplaintEntity.prototype, "activities", void 0);
exports.ComplaintEntity = ComplaintEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('complaint')
], ComplaintEntity);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintStatus = void 0;
const graphql_1 = __webpack_require__(7);
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["Submitted"] = "Submitted";
    ComplaintStatus["UnderInvestigation"] = "UnderInvestigation";
    ComplaintStatus["Resolved"] = "Resolved";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
(0, graphql_1.registerEnumType)(ComplaintStatus, { name: 'ComplaintStatus' });


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestEntity = void 0;
const tslib_1 = __webpack_require__(1);
// libs/database/src/lib/entities/request.entity.ts
const typeorm_1 = __webpack_require__(11);
const multipoint_transformer_1 = __webpack_require__(24);
const complaint_entity_1 = __webpack_require__(21);
const coupon_entity_1 = __webpack_require__(25);
const driver_transaction_entity_1 = __webpack_require__(14);
const driver_entity_1 = __webpack_require__(13);
const order_status_enum_1 = __webpack_require__(77);
const feedback_entity_1 = __webpack_require__(78);
const fleet_transaction_entity_1 = __webpack_require__(67);
const request_message_entity_1 = __webpack_require__(80);
const payment_gateway_entity_1 = __webpack_require__(33);
const provider_transaction_entity_1 = __webpack_require__(40);
const rider_entity_1 = __webpack_require__(26);
const rider_transaction_entity_1 = __webpack_require__(34);
const service_entity_1 = __webpack_require__(52);
const operator_entity_1 = __webpack_require__(19);
const request_activity_entity_1 = __webpack_require__(82);
const service_option_entity_1 = __webpack_require__(60);
const sos_entity_1 = __webpack_require__(84);
const fleet_entity_1 = __webpack_require__(64);
const order_cancel_reason_entity_1 = __webpack_require__(88);
const payment_mode_enum_1 = __webpack_require__(89);
const saved_payment_method_entity_1 = __webpack_require__(44);
const rider_review_entity_1 = __webpack_require__(76);
const vehicle_type_enum_1 = __webpack_require__(90); // NEW: Import VehicleType enum
let RequestEntity = class RequestEntity {
};
exports.RequestEntity = RequestEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'requestTimestamp' }),
    tslib_1.__metadata("design:type", Date)
], RequestEntity.prototype, "createdOn", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], RequestEntity.prototype, "startTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], RequestEntity.prototype, "finishTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: order_status_enum_1.OrderStatus,
        default: order_status_enum_1.OrderStatus.Requested,
    }),
    tslib_1.__metadata("design:type", String)
], RequestEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "distanceBest", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "durationBest", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "waitMinutes", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "waitCost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "rideOptionsCost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "taxCost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "serviceCost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Date)
], RequestEntity.prototype, "expectedTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], RequestEntity.prototype, "etaPickup", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "costBest", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
        default: '0.00',
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "costAfterCoupon", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
        default: '0.00',
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "tipAmount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0,
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "paidAmount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        default: 0,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "providerShare", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('tinyint', {
        default: -1,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "destinationArrivedTo", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_activity_entity_1.RequestActivityEntity, (activity) => activity.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "activities", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        transformer: {
            to(value) {
                return value.join('|');
            },
            from(value) {
                if (value == null)
                    return [];
                return value.split('|');
            },
        },
    }),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "addresses", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('multipoint', {
        transformer: new multipoint_transformer_1.MultipointTransformer(),
    }),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "points", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('multipoint', {
        transformer: new multipoint_transformer_1.MultipointTransformer(),
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "directions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('multipoint', {
        transformer: new multipoint_transformer_1.MultipointTransformer(),
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "driverDirections", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: () => 'CURRENT_TIMESTAMP',
    }),
    tslib_1.__metadata("design:type", Date)
], RequestEntity.prototype, "driverLastSeenMessagesAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: () => 'CURRENT_TIMESTAMP',
    }),
    tslib_1.__metadata("design:type", Date)
], RequestEntity.prototype, "riderLastSeenMessagesAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.orders),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], RequestEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => rider_entity_1.RiderEntity, (rider) => rider.orders),
    tslib_1.__metadata("design:type", rider_entity_1.RiderEntity)
], RequestEntity.prototype, "rider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "riderId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => coupon_entity_1.CouponEntity, (coupon) => coupon.orders),
    tslib_1.__metadata("design:type", coupon_entity_1.CouponEntity)
], RequestEntity.prototype, "coupon", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "couponId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: 3 }),
    tslib_1.__metadata("design:type", String)
], RequestEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_message_entity_1.OrderMessageEntity, (message) => message.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "conversation", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: payment_mode_enum_1.PaymentMode,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RequestEntity.prototype, "paymentMode", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, (gateway) => gateway.orders),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], RequestEntity.prototype, "paymentGateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "paymentGatewayId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => saved_payment_method_entity_1.SavedPaymentMethodEntity, (method) => method.orders),
    tslib_1.__metadata("design:type", saved_payment_method_entity_1.SavedPaymentMethodEntity)
], RequestEntity.prototype, "savedPaymentMethod", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "savedPaymentMethodId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => complaint_entity_1.ComplaintEntity, (complaint) => complaint.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "complaints", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => service_entity_1.ServiceEntity, (service) => service.requests),
    tslib_1.__metadata("design:type", service_entity_1.ServiceEntity)
], RequestEntity.prototype, "service", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "serviceId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, (operator) => operator.requests, {
        onDelete: 'CASCADE',
    }),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], RequestEntity.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => fleet_entity_1.FleetEntity, (fleet) => fleet.requests, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", fleet_entity_1.FleetEntity)
], RequestEntity.prototype, "fleet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "fleetId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_transaction_entity_1.RiderTransactionEntity, (riderTransaction) => riderTransaction.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "riderTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => fleet_transaction_entity_1.FleetTransactionEntity, (fleetTransaction) => fleetTransaction.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "fleetTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => feedback_entity_1.FeedbackEntity, (feedback) => feedback.request),
    tslib_1.__metadata("design:type", feedback_entity_1.FeedbackEntity)
], RequestEntity.prototype, "review", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_transaction_entity_1.DriverTransactionEntity, (transaction) => transaction.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "driverTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => provider_transaction_entity_1.ProviderTransactionEntity, (transaction) => transaction.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "providerTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => service_option_entity_1.ServiceOptionEntity, (option) => option.requests, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "options", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => sos_entity_1.SOSEntity, (sos) => sos.request),
    tslib_1.__metadata("design:type", Array)
], RequestEntity.prototype, "sosCalls", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => order_cancel_reason_entity_1.OrderCancelReasonEntity, (order) => order.orders),
    tslib_1.__metadata("design:type", order_cancel_reason_entity_1.OrderCancelReasonEntity)
], RequestEntity.prototype, "cancelReason", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "cancelReasonId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RequestEntity.prototype, "cancelReasonNote", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => rider_review_entity_1.RiderReviewEntity, (review) => review.request),
    tslib_1.__metadata("design:type", rider_review_entity_1.RiderReviewEntity)
], RequestEntity.prototype, "driverReviewForRider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: vehicle_type_enum_1.VehicleType,
        nullable: true, // Або false, якщо тип транспорту завжди має бути вказаний при створенні
    }),
    tslib_1.__metadata("design:type", String)
], RequestEntity.prototype, "vehicleType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', {
        default: 0, // За замовчуванням вантажники не потрібні
        comment: 'Number of loaders requested (0, 1, 2, etc.)'
    }),
    tslib_1.__metadata("design:type", Number)
], RequestEntity.prototype, "loadersCount", void 0);
exports.RequestEntity = RequestEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('request')
], RequestEntity);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultipointTransformer = void 0;
class MultipointTransformer {
    to(value) {
        if (value == null || value.length < 1)
            return null;
        return `MULTIPOINT(${value.map((x) => `${x.lng} ${x.lat}`).join(',')})`;
    }
    from(value) {
        if (value == null)
            return [];
        const i = value.substring(11, value.length - 1).split(',').map(x => {
            const s = x.substring(1, x.length - 1).split(' ');
            return {
                lng: parseFloat(s[0]),
                lat: parseFloat(s[1])
            };
        });
        return i;
    }
}
exports.MultipointTransformer = MultipointTransformer;


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const request_entity_1 = __webpack_require__(23);
const rider_entity_1 = __webpack_require__(26);
const service_entity_1 = __webpack_require__(52);
let CouponEntity = class CouponEntity {
};
exports.CouponEntity = CouponEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], CouponEntity.prototype, "code", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], CouponEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CouponEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: 0
    }),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "manyUsersCanUse", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: 1
    }),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "manyTimesUserCanUse", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("float", {
        default: '0.00',
        precision: 10,
        scale: 2
    }),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "minimumCost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("float", {
        default: '0.00',
        precision: 10,
        scale: 2
    }),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "maximumCost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'startTimestamp' }),
    tslib_1.__metadata("design:type", Date)
], CouponEntity.prototype, "startAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'expirationTimestamp', nullable: true }),
    tslib_1.__metadata("design:type", Date)
], CouponEntity.prototype, "expireAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("tinyint", {
        default: 0
    }),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "discountPercent", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("float", {
        default: 0,
        precision: 10,
        scale: 2
    }),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "discountFlat", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("float", {
        default: 0,
        precision: 10,
        scale: 2
    }),
    tslib_1.__metadata("design:type", Number)
], CouponEntity.prototype, "creditGift", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: true
    }),
    tslib_1.__metadata("design:type", Boolean)
], CouponEntity.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    tslib_1.__metadata("design:type", Boolean)
], CouponEntity.prototype, "isFirstTravelOnly", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.ServiceEntity, service => service.allowedCoupons),
    (0, typeorm_1.JoinTable)({ name: 'coupon_services_service' }),
    tslib_1.__metadata("design:type", Array)
], CouponEntity.prototype, "allowedServices", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => rider_entity_1.RiderEntity, rider => rider.coupons),
    tslib_1.__metadata("design:type", Array)
], CouponEntity.prototype, "riders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, order => order.coupon, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' }),
    tslib_1.__metadata("design:type", Array)
], CouponEntity.prototype, "orders", void 0);
exports.CouponEntity = CouponEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('coupon')
], CouponEntity);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const coupon_entity_1 = __webpack_require__(25);
const gender_enum_1 = __webpack_require__(27);
const rider_document_type_1 = __webpack_require__(28);
const rider_status_enum_1 = __webpack_require__(29);
const media_entity_1 = __webpack_require__(30);
const request_entity_1 = __webpack_require__(23);
const rider_address_entity_1 = __webpack_require__(71);
const rider_transaction_entity_1 = __webpack_require__(34);
const rider_wallet_entity_1 = __webpack_require__(75);
const saved_payment_method_entity_1 = __webpack_require__(44);
const rider_review_entity_1 = __webpack_require__(76);
const driver_entity_1 = __webpack_require__(13);
let RiderEntity = class RiderEntity {
};
exports.RiderEntity = RiderEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RiderEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: rider_status_enum_1.RiderStatus,
        default: rider_status_enum_1.RiderStatus.Enabled,
    }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 5 }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "countryIso", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('bigint', {
        unique: true,
    }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], RiderEntity.prototype, "registrationTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: gender_enum_1.Gender,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('varchar', {
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "address", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], RiderEntity.prototype, "isResident", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "idNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        //enum: RiderDocumentType
    }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "documentType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RiderEntity.prototype, "notificationPlayerId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], RiderEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_address_entity_1.RiderAddressEntity, (address) => address.rider),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "addresses", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, (media) => media.rider),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], RiderEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RiderEntity.prototype, "mediaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', {
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], RiderEntity.prototype, "presetAvatarNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (order) => order.rider),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_wallet_entity_1.RiderWalletEntity, (wallet) => wallet.rider),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "wallets", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => driver_entity_1.DriverEntity, (driver) => driver.ridersFavorited),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "favoriteDrivers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => driver_entity_1.DriverEntity, (driver) => driver.ridersBlocked),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "blockedDrivers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_transaction_entity_1.RiderTransactionEntity, (riderTransaction) => riderTransaction.rider, { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "transactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => coupon_entity_1.CouponEntity, (coupon) => coupon.riders),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "coupons", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => saved_payment_method_entity_1.SavedPaymentMethodEntity, (savedPaymentMethod) => savedPaymentMethod.rider),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "savedPaymentMethods", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_review_entity_1.RiderReviewEntity, (review) => review.rider),
    tslib_1.__metadata("design:type", Array)
], RiderEntity.prototype, "reviewsForRider", void 0);
exports.RiderEntity = RiderEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('rider')
], RiderEntity);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Gender = void 0;
const graphql_1 = __webpack_require__(7);
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Unknown"] = "unknown";
})(Gender || (exports.Gender = Gender = {}));
(0, graphql_1.registerEnumType)(Gender, { name: 'Gender' });


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderDocumentType = void 0;
const graphql_1 = __webpack_require__(7);
var RiderDocumentType;
(function (RiderDocumentType) {
    RiderDocumentType["ID"] = "ID";
    RiderDocumentType["Passport"] = "Passport";
    RiderDocumentType["DriverLicense"] = "DriverLicense";
    RiderDocumentType["ResidentPermitID"] = "ResidentPermitID";
})(RiderDocumentType || (exports.RiderDocumentType = RiderDocumentType = {}));
(0, graphql_1.registerEnumType)(RiderDocumentType, { name: 'RiderDocumentType' });


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderStatus = void 0;
const graphql_1 = __webpack_require__(7);
var RiderStatus;
(function (RiderStatus) {
    RiderStatus["Enabled"] = "enabled";
    RiderStatus["Disabled"] = "blocked";
})(RiderStatus || (exports.RiderStatus = RiderStatus = {}));
(0, graphql_1.registerEnumType)(RiderStatus, { name: 'RiderStatus' });


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const announcement_entity_1 = __webpack_require__(31);
const driver_entity_1 = __webpack_require__(13);
const operator_entity_1 = __webpack_require__(19);
const payment_gateway_entity_1 = __webpack_require__(33);
const rider_entity_1 = __webpack_require__(26);
const service_entity_1 = __webpack_require__(52);
const payout_method_entity_1 = __webpack_require__(48);
let MediaEntity = class MediaEntity {
};
exports.MediaEntity = MediaEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], MediaEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('varchar'),
    tslib_1.__metadata("design:type", String)
], MediaEntity.prototype, "address", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('longtext', {
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], MediaEntity.prototype, "base64", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.media, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], MediaEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.documents, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], MediaEntity.prototype, "driverDocument", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], MediaEntity.prototype, "driverDocumentId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => operator_entity_1.OperatorEntity, (operator) => operator.media, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], MediaEntity.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => announcement_entity_1.AnnouncementEntity, (announcement) => announcement.media, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", announcement_entity_1.AnnouncementEntity)
], MediaEntity.prototype, "announcement", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => rider_entity_1.RiderEntity, (rider) => rider.media, { onDelete: 'SET NULL' }),
    tslib_1.__metadata("design:type", Array)
], MediaEntity.prototype, "rider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => service_entity_1.ServiceEntity, (service) => service.media, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", Array)
], MediaEntity.prototype, "service", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, (gateway) => gateway.media, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], MediaEntity.prototype, "paymentGateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => payout_method_entity_1.PayoutMethodEntity, (payoutMethod) => payoutMethod.media, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", payout_method_entity_1.PayoutMethodEntity)
], MediaEntity.prototype, "payoutMethod", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.uploads, {
        onDelete: 'SET NULL',
    }),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], MediaEntity.prototype, "uploadedByDriver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], MediaEntity.prototype, "uploadedByDriverId", void 0);
exports.MediaEntity = MediaEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('media')
], MediaEntity);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnnouncementEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const anouncement_user_type_enum_1 = __webpack_require__(32);
const media_entity_1 = __webpack_require__(30);
let AnnouncementEntity = class AnnouncementEntity {
};
exports.AnnouncementEntity = AnnouncementEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], AnnouncementEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('set', {
        enum: anouncement_user_type_enum_1.AnnouncementUserType,
        default: [anouncement_user_type_enum_1.AnnouncementUserType.Rider],
    }),
    tslib_1.__metadata("design:type", Array)
], AnnouncementEntity.prototype, "userType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        name: 'startTimestamp',
    }),
    tslib_1.__metadata("design:type", Date)
], AnnouncementEntity.prototype, "startAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        name: 'expirationTimestamp',
    }),
    tslib_1.__metadata("design:type", Date)
], AnnouncementEntity.prototype, "expireAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AnnouncementEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], AnnouncementEntity.prototype, "url", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AnnouncementEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, (media) => media.announcement),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], AnnouncementEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], AnnouncementEntity.prototype, "mediaId", void 0);
exports.AnnouncementEntity = AnnouncementEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('promotion')
], AnnouncementEntity);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnnouncementUserType = void 0;
const graphql_1 = __webpack_require__(7);
var AnnouncementUserType;
(function (AnnouncementUserType) {
    AnnouncementUserType["Driver"] = "Driver";
    AnnouncementUserType["Rider"] = "Rider";
    AnnouncementUserType["Operator"] = "Operator";
})(AnnouncementUserType || (exports.AnnouncementUserType = AnnouncementUserType = {}));
(0, graphql_1.registerEnumType)(AnnouncementUserType, { name: 'AnnouncementUserType' });


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentGatewayEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const request_entity_1 = __webpack_require__(23);
const rider_transaction_entity_1 = __webpack_require__(34);
const payment_gateway_type_enum_1 = __webpack_require__(39);
const provider_transaction_entity_1 = __webpack_require__(40);
const media_entity_1 = __webpack_require__(30);
const gateway_to_user_entity_1 = __webpack_require__(43);
const saved_payment_method_entity_1 = __webpack_require__(44);
const payout_account_entity_1 = __webpack_require__(47);
let PaymentGatewayEntity = class PaymentGatewayEntity {
};
exports.PaymentGatewayEntity = PaymentGatewayEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PaymentGatewayEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], PaymentGatewayEntity.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: payment_gateway_type_enum_1.PaymentGatewayType,
    }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'text',
    }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayEntity.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayEntity.prototype, "privateKey", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayEntity.prototype, "saltKey", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'text',
    }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayEntity.prototype, "merchantId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PaymentGatewayEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, (media) => media.paymentGateway, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], PaymentGatewayEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PaymentGatewayEntity.prototype, "mediaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (order) => order.paymentGateway),
    tslib_1.__metadata("design:type", Array)
], PaymentGatewayEntity.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => rider_transaction_entity_1.RiderTransactionEntity, (userTransaction) => userTransaction.paymentGateway),
    tslib_1.__metadata("design:type", Array)
], PaymentGatewayEntity.prototype, "riderTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => provider_transaction_entity_1.ProviderTransactionEntity, (adminTransaction) => adminTransaction.paymentGateway),
    tslib_1.__metadata("design:type", Array)
], PaymentGatewayEntity.prototype, "adminTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => gateway_to_user_entity_1.GatewayToUserEntity, (gatewayToUser) => gatewayToUser.gateway),
    tslib_1.__metadata("design:type", Array)
], PaymentGatewayEntity.prototype, "userIds", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => saved_payment_method_entity_1.SavedPaymentMethodEntity, (savedPaymentMethod) => savedPaymentMethod.paymentGateway),
    tslib_1.__metadata("design:type", Array)
], PaymentGatewayEntity.prototype, "savedPaymentMethods", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => payout_account_entity_1.PayoutAccountEntity, (payout) => payout.paymentGateway),
    tslib_1.__metadata("design:type", Array)
], PaymentGatewayEntity.prototype, "payoutAccounts", void 0);
exports.PaymentGatewayEntity = PaymentGatewayEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('payment_gateway')
], PaymentGatewayEntity);


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderTransactionEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const rider_deduct_transaction_type_enum_1 = __webpack_require__(35);
const rider_recharge_transaction_type_enum_1 = __webpack_require__(36);
const transaction_action_enum_1 = __webpack_require__(17);
const transaction_status_enum_1 = __webpack_require__(18);
const operator_entity_1 = __webpack_require__(19);
const request_entity_1 = __webpack_require__(23);
const payment_gateway_entity_1 = __webpack_require__(33);
const rider_entity_1 = __webpack_require__(26);
const gift_code_entity_1 = __webpack_require__(37);
let RiderTransactionEntity = class RiderTransactionEntity {
};
exports.RiderTransactionEntity = RiderTransactionEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'transactionTime' }),
    tslib_1.__metadata("design:type", Date)
], RiderTransactionEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: transaction_status_enum_1.TransactionStatus,
        default: transaction_status_enum_1.TransactionStatus.Processing,
    }),
    tslib_1.__metadata("design:type", String)
], RiderTransactionEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', { enum: transaction_action_enum_1.TransactionAction }),
    tslib_1.__metadata("design:type", String)
], RiderTransactionEntity.prototype, "action", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: rider_deduct_transaction_type_enum_1.RiderDeductTransactionType,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RiderTransactionEntity.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: rider_recharge_transaction_type_enum_1.RiderRechargeTransactionType,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], RiderTransactionEntity.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionEntity.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: '3' }),
    tslib_1.__metadata("design:type", String)
], RiderTransactionEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'documentNumber' }),
    tslib_1.__metadata("design:type", String)
], RiderTransactionEntity.prototype, "refrenceNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'details' }),
    tslib_1.__metadata("design:type", String)
], RiderTransactionEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => rider_entity_1.RiderEntity, (rider) => rider.transactions),
    tslib_1.__metadata("design:type", rider_entity_1.RiderEntity)
], RiderTransactionEntity.prototype, "rider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionEntity.prototype, "riderId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, (gateway) => gateway.riderTransactions),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], RiderTransactionEntity.prototype, "paymentGateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionEntity.prototype, "paymentGatewayId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, (operator) => operator.riderTransactions),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], RiderTransactionEntity.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'operatorId' }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionEntity.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => gift_code_entity_1.GiftCodeEntity, (giftCard) => giftCard.riderTransaction),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", gift_code_entity_1.GiftCodeEntity)
], RiderTransactionEntity.prototype, "giftCard", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionEntity.prototype, "giftCardId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, (order) => order.riderTransactions),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], RiderTransactionEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionEntity.prototype, "requestId", void 0);
exports.RiderTransactionEntity = RiderTransactionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('rider_transaction')
], RiderTransactionEntity);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderDeductTransactionType = void 0;
const graphql_1 = __webpack_require__(7);
var RiderDeductTransactionType;
(function (RiderDeductTransactionType) {
    RiderDeductTransactionType["OrderFee"] = "OrderFee";
    RiderDeductTransactionType["ParkingFee"] = "ParkingFee";
    RiderDeductTransactionType["CancellationFee"] = "CancellationFee";
    RiderDeductTransactionType["Withdraw"] = "Withdraw";
    RiderDeductTransactionType["Correction"] = "Correction";
})(RiderDeductTransactionType || (exports.RiderDeductTransactionType = RiderDeductTransactionType = {}));
(0, graphql_1.registerEnumType)(RiderDeductTransactionType, {
    name: 'RiderDeductTransactionType',
});


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderRechargeTransactionType = void 0;
const graphql_1 = __webpack_require__(7);
var RiderRechargeTransactionType;
(function (RiderRechargeTransactionType) {
    RiderRechargeTransactionType["BankTransfer"] = "BankTransfer";
    RiderRechargeTransactionType["Gift"] = "Gift";
    RiderRechargeTransactionType["Correction"] = "Correction";
    RiderRechargeTransactionType["InAppPayment"] = "InAppPayment";
})(RiderRechargeTransactionType || (exports.RiderRechargeTransactionType = RiderRechargeTransactionType = {}));
(0, graphql_1.registerEnumType)(RiderRechargeTransactionType, { name: 'RiderRechargeTransactionType' });


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftCodeEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const rider_transaction_entity_1 = __webpack_require__(34);
const driver_transaction_entity_1 = __webpack_require__(14);
const gift_batch_entity_1 = __webpack_require__(38);
let GiftCodeEntity = class GiftCodeEntity {
};
exports.GiftCodeEntity = GiftCodeEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], GiftCodeEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], GiftCodeEntity.prototype, "code", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Date)
], GiftCodeEntity.prototype, "usedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => driver_transaction_entity_1.DriverTransactionEntity, (driverTransaction) => driverTransaction.giftCard),
    tslib_1.__metadata("design:type", driver_transaction_entity_1.DriverTransactionEntity)
], GiftCodeEntity.prototype, "driverTransaction", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => rider_transaction_entity_1.RiderTransactionEntity, (riderTransaction) => riderTransaction.giftCard),
    tslib_1.__metadata("design:type", rider_transaction_entity_1.RiderTransactionEntity)
], GiftCodeEntity.prototype, "riderTransaction", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => gift_batch_entity_1.GiftBatchEntity, (gift) => gift.giftCodes),
    tslib_1.__metadata("design:type", gift_batch_entity_1.GiftBatchEntity)
], GiftCodeEntity.prototype, "gift", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], GiftCodeEntity.prototype, "giftId", void 0);
exports.GiftCodeEntity = GiftCodeEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('gift_code')
], GiftCodeEntity);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftBatchEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const gift_code_entity_1 = __webpack_require__(37);
const operator_entity_1 = __webpack_require__(19);
let GiftBatchEntity = class GiftBatchEntity {
};
exports.GiftBatchEntity = GiftBatchEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], GiftBatchEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], GiftBatchEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], GiftBatchEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('varchar', {
        length: 3,
    }),
    tslib_1.__metadata("design:type", String)
], GiftBatchEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], GiftBatchEntity.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Date)
], GiftBatchEntity.prototype, "availableFrom", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Date)
], GiftBatchEntity.prototype, "expireAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, (operator) => operator.giftBatchesCreated),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], GiftBatchEntity.prototype, "createdByOperator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], GiftBatchEntity.prototype, "createdByOperatorId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => gift_code_entity_1.GiftCodeEntity, (giftCode) => giftCode.gift),
    tslib_1.__metadata("design:type", Array)
], GiftBatchEntity.prototype, "giftCodes", void 0);
exports.GiftBatchEntity = GiftBatchEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('gift')
], GiftBatchEntity);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentGatewayType = void 0;
const graphql_1 = __webpack_require__(7);
var PaymentGatewayType;
(function (PaymentGatewayType) {
    PaymentGatewayType["Stripe"] = "stripe";
    PaymentGatewayType["BrainTree"] = "braintree";
    PaymentGatewayType["PayPal"] = "paypal";
    PaymentGatewayType["Paytm"] = "paytm";
    PaymentGatewayType["Razorpay"] = "razorpay";
    PaymentGatewayType["Paystack"] = "paystack";
    PaymentGatewayType["PayU"] = "payu";
    PaymentGatewayType["Instamojo"] = "instamojo";
    PaymentGatewayType["Flutterwave"] = "flutterwave";
    PaymentGatewayType["PayGate"] = "paygate";
    PaymentGatewayType["MIPS"] = "mips";
    PaymentGatewayType["MercadoPago"] = "mercadopago";
    PaymentGatewayType["AmazonPaymentServices"] = "amazon";
    PaymentGatewayType["MyTMoney"] = "mytmoney";
    PaymentGatewayType["WayForPay"] = "wayforpay";
    PaymentGatewayType["MyFatoorah"] = "MyFatoorah";
    PaymentGatewayType["SberBank"] = "SberBank";
    PaymentGatewayType["BinancePay"] = "BinancePay";
    PaymentGatewayType["OpenPix"] = "OpenPix";
    PaymentGatewayType["PayTR"] = "PayTR";
    PaymentGatewayType["CustomLink"] = "link";
})(PaymentGatewayType || (exports.PaymentGatewayType = PaymentGatewayType = {}));
(0, graphql_1.registerEnumType)(PaymentGatewayType, { name: 'PaymentGatewayType' });


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderTransactionEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const provider_deduct_transaction_type_enum_1 = __webpack_require__(41);
const provider_recharge_transaction_type_enum_1 = __webpack_require__(42);
const transaction_action_enum_1 = __webpack_require__(17);
const operator_entity_1 = __webpack_require__(19);
const payment_gateway_entity_1 = __webpack_require__(33);
const request_entity_1 = __webpack_require__(23);
let ProviderTransactionEntity = class ProviderTransactionEntity {
};
exports.ProviderTransactionEntity = ProviderTransactionEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'transactionTime' }),
    tslib_1.__metadata("design:type", Date)
], ProviderTransactionEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', { enum: transaction_action_enum_1.TransactionAction }),
    tslib_1.__metadata("design:type", String)
], ProviderTransactionEntity.prototype, "action", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType,
        nullable: true
    }),
    tslib_1.__metadata("design:type", String)
], ProviderTransactionEntity.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType,
        nullable: true
    }),
    tslib_1.__metadata("design:type", String)
], ProviderTransactionEntity.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2
    }),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionEntity.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: 3 }),
    tslib_1.__metadata("design:type", String)
], ProviderTransactionEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'documentNumber' }),
    tslib_1.__metadata("design:type", String)
], ProviderTransactionEntity.prototype, "refrenceNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'details' }),
    tslib_1.__metadata("design:type", String)
], ProviderTransactionEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, operator => operator.providerTransactions),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], ProviderTransactionEntity.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionEntity.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, order => order.providerTransactions, { onDelete: 'CASCADE' }),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], ProviderTransactionEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionEntity.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, gateway => gateway.adminTransactions, { onDelete: 'CASCADE' }),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], ProviderTransactionEntity.prototype, "paymentGateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionEntity.prototype, "paymentGatewayId", void 0);
exports.ProviderTransactionEntity = ProviderTransactionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('admin_transaction')
], ProviderTransactionEntity);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderDeductTransactionType = void 0;
const graphql_1 = __webpack_require__(7);
var ProviderDeductTransactionType;
(function (ProviderDeductTransactionType) {
    ProviderDeductTransactionType["Withdraw"] = "Withdraw";
})(ProviderDeductTransactionType || (exports.ProviderDeductTransactionType = ProviderDeductTransactionType = {}));
(0, graphql_1.registerEnumType)(ProviderDeductTransactionType, { name: 'ProviderDeductTransactionType' });


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderRechargeTransactionType = void 0;
const graphql_1 = __webpack_require__(7);
var ProviderRechargeTransactionType;
(function (ProviderRechargeTransactionType) {
    ProviderRechargeTransactionType["Commission"] = "Commission";
})(ProviderRechargeTransactionType || (exports.ProviderRechargeTransactionType = ProviderRechargeTransactionType = {}));
(0, graphql_1.registerEnumType)(ProviderRechargeTransactionType, { name: 'ProviderRechargeTransactionType' });


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatewayToUserEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const payment_gateway_entity_1 = __webpack_require__(33);
let GatewayToUserEntity = class GatewayToUserEntity {
};
exports.GatewayToUserEntity = GatewayToUserEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], GatewayToUserEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, (gateway) => gateway.userIds),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], GatewayToUserEntity.prototype, "gateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], GatewayToUserEntity.prototype, "gatewayId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], GatewayToUserEntity.prototype, "internalUserId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], GatewayToUserEntity.prototype, "externalReferenceNumber", void 0);
exports.GatewayToUserEntity = GatewayToUserEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('gateway_to_user')
], GatewayToUserEntity);


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SavedPaymentMethodEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const saved_payment_method_type_1 = __webpack_require__(45);
const rider_entity_1 = __webpack_require__(26);
const driver_entity_1 = __webpack_require__(13);
const payment_gateway_entity_1 = __webpack_require__(33);
const card_type_enum_1 = __webpack_require__(46);
const request_entity_1 = __webpack_require__(23);
let SavedPaymentMethodEntity = class SavedPaymentMethodEntity {
};
exports.SavedPaymentMethodEntity = SavedPaymentMethodEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], SavedPaymentMethodEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], SavedPaymentMethodEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], SavedPaymentMethodEntity.prototype, "lastFour", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], SavedPaymentMethodEntity.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], SavedPaymentMethodEntity.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: saved_payment_method_type_1.SavedPaymentMethodType,
    }),
    tslib_1.__metadata("design:type", String)
], SavedPaymentMethodEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: card_type_enum_1.ProviderBrand,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], SavedPaymentMethodEntity.prototype, "providerBrand", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Date)
], SavedPaymentMethodEntity.prototype, "expiryDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], SavedPaymentMethodEntity.prototype, "holderName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => rider_entity_1.RiderEntity, (rider) => rider.savedPaymentMethods),
    tslib_1.__metadata("design:type", rider_entity_1.RiderEntity)
], SavedPaymentMethodEntity.prototype, "rider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], SavedPaymentMethodEntity.prototype, "riderId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.savedPaymentMethods),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], SavedPaymentMethodEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], SavedPaymentMethodEntity.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], SavedPaymentMethodEntity.prototype, "token", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, (gateway) => gateway.savedPaymentMethods),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], SavedPaymentMethodEntity.prototype, "paymentGateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], SavedPaymentMethodEntity.prototype, "paymentGatewayId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (order) => order.savedPaymentMethod),
    tslib_1.__metadata("design:type", Array)
], SavedPaymentMethodEntity.prototype, "orders", void 0);
exports.SavedPaymentMethodEntity = SavedPaymentMethodEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('saved_payment_method')
], SavedPaymentMethodEntity);


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SavedPaymentMethodType = void 0;
const graphql_1 = __webpack_require__(7);
var SavedPaymentMethodType;
(function (SavedPaymentMethodType) {
    SavedPaymentMethodType["CARD"] = "CARD";
    SavedPaymentMethodType["BANK_ACCOUNT"] = "BANK_ACCOUNT";
})(SavedPaymentMethodType || (exports.SavedPaymentMethodType = SavedPaymentMethodType = {}));
(0, graphql_1.registerEnumType)(SavedPaymentMethodType, {
    name: 'SavedPaymentMethodType',
    description: 'Saved payment method type',
});


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderBrand = void 0;
const graphql_1 = __webpack_require__(7);
var ProviderBrand;
(function (ProviderBrand) {
    ProviderBrand["Visa"] = "visa";
    ProviderBrand["Mastercard"] = "mastercard";
    ProviderBrand["Amex"] = "amex";
    ProviderBrand["Discover"] = "discover";
    ProviderBrand["Diners"] = "diners";
    ProviderBrand["EftPosAu"] = "eftpos_au";
    ProviderBrand["JCB"] = "jcb";
    ProviderBrand["UnionPay"] = "unionpay";
    ProviderBrand["Unknown"] = "unknown";
})(ProviderBrand || (exports.ProviderBrand = ProviderBrand = {}));
(0, graphql_1.registerEnumType)(ProviderBrand, {
    name: 'ProviderBrand',
    description: 'Brand of the provider wether bank name or card provider',
});


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutAccountEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_entity_1 = __webpack_require__(13);
const payment_gateway_entity_1 = __webpack_require__(33);
const payout_method_entity_1 = __webpack_require__(48);
const saved_payment_method_type_1 = __webpack_require__(45);
const driver_transaction_entity_1 = __webpack_require__(14);
let PayoutAccountEntity = class PayoutAccountEntity {
};
exports.PayoutAccountEntity = PayoutAccountEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PayoutAccountEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.payoutAccounts),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], PayoutAccountEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], PayoutAccountEntity.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_gateway_entity_1.PaymentGatewayEntity, (gateway) => gateway.payoutAccounts),
    tslib_1.__metadata("design:type", payment_gateway_entity_1.PaymentGatewayEntity)
], PayoutAccountEntity.prototype, "paymentGateway", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PayoutAccountEntity.prototype, "paymentGatewayId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: saved_payment_method_type_1.SavedPaymentMethodType,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "last4", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => payout_method_entity_1.PayoutMethodEntity, (payoutMethod) => payoutMethod.payoutAccounts),
    tslib_1.__metadata("design:type", payout_method_entity_1.PayoutMethodEntity)
], PayoutAccountEntity.prototype, "payoutMethod", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], PayoutAccountEntity.prototype, "payoutMethodId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "token", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "routingNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountHolderName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "bankName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "branchName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountHolderAddress", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountHolderCity", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountHolderState", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountHolderZip", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountHolderCountry", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutAccountEntity.prototype, "accountHolderPhone", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Date)
], PayoutAccountEntity.prototype, "accountHolderDateOfBirth", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], PayoutAccountEntity.prototype, "isVerified", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], PayoutAccountEntity.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PayoutAccountEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PayoutAccountEntity.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PayoutAccountEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_transaction_entity_1.DriverTransactionEntity, (driverTransaction) => driverTransaction.payoutAccount),
    tslib_1.__metadata("design:type", Array)
], PayoutAccountEntity.prototype, "driverTransactions", void 0);
exports.PayoutAccountEntity = PayoutAccountEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('payout_account')
], PayoutAccountEntity);


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutMethodEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const media_entity_1 = __webpack_require__(30);
const payout_method_type_enum_1 = __webpack_require__(49);
const payout_account_entity_1 = __webpack_require__(47);
const payout_session_entity_1 = __webpack_require__(50);
const driver_transaction_entity_1 = __webpack_require__(14);
let PayoutMethodEntity = class PayoutMethodEntity {
};
exports.PayoutMethodEntity = PayoutMethodEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PayoutMethodEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], PayoutMethodEntity.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: payout_method_type_enum_1.PayoutMethodType,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'text',
    }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'text',
    }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "privateKey", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "saltKey", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'text',
    }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodEntity.prototype, "merchantId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PayoutMethodEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, (media) => media.payoutMethod, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], PayoutMethodEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PayoutMethodEntity.prototype, "mediaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => payout_account_entity_1.PayoutAccountEntity, (payoutAccount) => payoutAccount.payoutMethod),
    tslib_1.__metadata("design:type", Array)
], PayoutMethodEntity.prototype, "payoutAccounts", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => payout_session_entity_1.PayoutSessionEntity, (payoutSession) => payoutSession.payoutMethods),
    tslib_1.__metadata("design:type", Array)
], PayoutMethodEntity.prototype, "payoutSessions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_transaction_entity_1.DriverTransactionEntity, (driverTransaction) => driverTransaction.payoutMethod),
    tslib_1.__metadata("design:type", Array)
], PayoutMethodEntity.prototype, "driverTransactions", void 0);
exports.PayoutMethodEntity = PayoutMethodEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('payout_method')
], PayoutMethodEntity);


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutMethodType = void 0;
const graphql_1 = __webpack_require__(7);
var PayoutMethodType;
(function (PayoutMethodType) {
    PayoutMethodType["Stripe"] = "stripe";
    PayoutMethodType["BankTransfer"] = "bank_transfer";
})(PayoutMethodType || (exports.PayoutMethodType = PayoutMethodType = {}));
(0, graphql_1.registerEnumType)(PayoutMethodType, {
    name: 'PayoutMethodType',
    description: 'The type of payout method',
});


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutSessionEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_transaction_entity_1 = __webpack_require__(14);
const payout_session_status_enum_1 = __webpack_require__(51);
const operator_entity_1 = __webpack_require__(19);
const payout_method_entity_1 = __webpack_require__(48);
let PayoutSessionEntity = class PayoutSessionEntity {
};
exports.PayoutSessionEntity = PayoutSessionEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PayoutSessionEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PayoutSessionEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Date)
], PayoutSessionEntity.prototype, "processedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutSessionEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: payout_session_status_enum_1.PayoutSessionStatus.PENDING,
        type: 'enum',
        enum: payout_session_status_enum_1.PayoutSessionStatus,
    }),
    tslib_1.__metadata("design:type", String)
], PayoutSessionEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => payout_method_entity_1.PayoutMethodEntity, (payoutMethod) => payoutMethod.payoutSessions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], PayoutSessionEntity.prototype, "payoutMethods", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_transaction_entity_1.DriverTransactionEntity, (driverTransaction) => driverTransaction.payoutSession),
    tslib_1.__metadata("design:type", Array)
], PayoutSessionEntity.prototype, "driverTransactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], PayoutSessionEntity.prototype, "totalAmount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PayoutSessionEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, (operator) => operator.payoutSessionsCreated),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], PayoutSessionEntity.prototype, "createdByOperator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], PayoutSessionEntity.prototype, "createdByOperatorId", void 0);
exports.PayoutSessionEntity = PayoutSessionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('payout_session')
], PayoutSessionEntity);


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutSessionStatus = void 0;
const graphql_1 = __webpack_require__(7);
var PayoutSessionStatus;
(function (PayoutSessionStatus) {
    PayoutSessionStatus["PENDING"] = "pending";
    PayoutSessionStatus["PAID"] = "paid";
    PayoutSessionStatus["FAILED"] = "failed";
    PayoutSessionStatus["CANCELLED"] = "cancelled";
})(PayoutSessionStatus || (exports.PayoutSessionStatus = PayoutSessionStatus = {}));
(0, graphql_1.registerEnumType)(PayoutSessionStatus, {
    name: 'PayoutSessionStatus',
    description: undefined,
});


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceEntity = void 0;
const tslib_1 = __webpack_require__(1);
// libs/database/src/lib/entities/service.entity.ts
const typeorm_1 = __webpack_require__(11);
const distance_multiplier_transformer_1 = __webpack_require__(53);
const time_multiplier_transformer_1 = __webpack_require__(54);
const coupon_entity_1 = __webpack_require__(25);
const driver_entity_1 = __webpack_require__(13);
const service_distance_fee_mode_enum_1 = __webpack_require__(55);
const service_payment_method_enum_1 = __webpack_require__(56);
const media_entity_1 = __webpack_require__(30);
const request_entity_1 = __webpack_require__(23);
const region_entity_1 = __webpack_require__(57);
const service_category_entity_1 = __webpack_require__(59);
const service_option_entity_1 = __webpack_require__(60);
const zone_price_entity_1 = __webpack_require__(63);
const weekday_multiplier_transformer_1 = __webpack_require__(69);
const date_range_multiplier_transformer_1 = __webpack_require__(70);
let ServiceEntity = class ServiceEntity {
};
exports.ServiceEntity = ServiceEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => service_category_entity_1.ServiceCategoryEntity, (category) => category.services, {
        onDelete: 'CASCADE',
    }),
    tslib_1.__metadata("design:type", service_category_entity_1.ServiceCategoryEntity)
], ServiceEntity.prototype, "category", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'title' }),
    tslib_1.__metadata("design:type", String)
], ServiceEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ServiceEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('smallint', { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "personCapacity", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    tslib_1.__metadata("design:type", Object)
], ServiceEntity.prototype, "vehicleTariffs", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 12,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "perMinuteWait", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', {
        default: 10000,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "searchRadius", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: service_payment_method_enum_1.ServicePaymentMethod,
        default: service_payment_method_enum_1.ServicePaymentMethod.CashCredit,
    }),
    tslib_1.__metadata("design:type", String)
], ServiceEntity.prototype, "paymentMethod", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: service_distance_fee_mode_enum_1.ServiceDistanceFeeMode,
        default: service_distance_fee_mode_enum_1.ServiceDistanceFeeMode.PickupToDestination,
    }),
    tslib_1.__metadata("design:type", String)
], ServiceEntity.prototype, "distanceFeeMode", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('time', {
        default: '00:00',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceEntity.prototype, "availableTimeFrom", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('time', {
        default: '23:59',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceEntity.prototype, "availableTimeTo", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', { default: 0, name: 'maxDestinationDistance' }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "maximumDestinationDistance", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('tinyint', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "prepayPercent", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], ServiceEntity.prototype, "twoWayAvailable", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "cancellationTotalFee", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "cancellationDriverShare", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('tinyint', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "providerSharePercent", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "providerShareFlat", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        nullable: true,
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "roundingFactor", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, (media) => media.service),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], ServiceEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "mediaId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('simple-array', {
        nullable: true,
        transformer: new time_multiplier_transformer_1.TimeMultiplierTransformer(),
    }),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "timeMultipliers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('simple-array', {
        nullable: true,
        transformer: new distance_multiplier_transformer_1.DistanceMultiplierTransformer(),
    }),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "distanceMultipliers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('simple-array', {
        nullable: true,
        transformer: new date_range_multiplier_transformer_1.DateRangeMultiplierTransformer(),
    }),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "dateRangeMultipliers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('simple-array', {
        nullable: true,
        transformer: new weekday_multiplier_transformer_1.WeekdayMultiplierTransformer(),
    }),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "weekdayMultipliers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], ServiceEntity.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', { default: 1.0 }),
    tslib_1.__metadata("design:type", Number)
], ServiceEntity.prototype, "touristMultiplier", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => driver_entity_1.DriverEntity, (driver) => driver.enabledServices),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "drivers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => coupon_entity_1.CouponEntity, (coupon) => coupon.allowedServices),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "allowedCoupons", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => region_entity_1.RegionEntity, (region) => region.services),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "regions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (order) => order.service),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "requests", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => service_option_entity_1.ServiceOptionEntity, (serviceOption) => serviceOption.services),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], ServiceEntity.prototype, "options", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => zone_price_entity_1.ZonePriceEntity, (zonePrice) => zonePrice.fleets) // TODO: Check relation name 'fleets'
    ,
    tslib_1.__metadata("design:type", zone_price_entity_1.ZonePriceEntity)
], ServiceEntity.prototype, "zonePrices", void 0);
exports.ServiceEntity = ServiceEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('service')
], ServiceEntity);


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DistanceMultiplierTransformer = void 0;
class DistanceMultiplierTransformer {
    to(value) {
        if (value == null) {
            return [];
        }
        return value.map((row) => `${row.distanceFrom}-${row.distanceTo}|${row.multiply}`);
    }
    from(value) {
        if (value == null) {
            return [];
        }
        return value.map(str => {
            return {
                distanceFrom: parseInt(str.split('|')[0].split('-')[0]),
                distanceTo: parseInt(str.split('|')[0].split('-')[1]),
                multiply: parseFloat(str.split('|')[1])
            };
        });
    }
}
exports.DistanceMultiplierTransformer = DistanceMultiplierTransformer;


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeMultiplierTransformer = void 0;
class TimeMultiplierTransformer {
    to(value) {
        if (value == null) {
            return [];
        }
        return value.map((row) => `${row.startTime}-${row.endTime}|${row.multiply}`);
    }
    from(value) {
        if (value == null) {
            return [];
        }
        return value.map(str => {
            return {
                startTime: str.split('|')[0].split('-')[0],
                endTime: str.split('|')[0].split('-')[1],
                multiply: parseFloat(str.split('|')[1])
            };
        });
    }
}
exports.TimeMultiplierTransformer = TimeMultiplierTransformer;


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceDistanceFeeMode = void 0;
const graphql_1 = __webpack_require__(7);
var ServiceDistanceFeeMode;
(function (ServiceDistanceFeeMode) {
    ServiceDistanceFeeMode["None"] = "None";
    ServiceDistanceFeeMode["PickupToDestination"] = "PickupToDestination";
    ServiceDistanceFeeMode["Radial"] = "Radial";
})(ServiceDistanceFeeMode || (exports.ServiceDistanceFeeMode = ServiceDistanceFeeMode = {}));
(0, graphql_1.registerEnumType)(ServiceDistanceFeeMode, { name: 'ServiceDistanceFeeMode' });


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicePaymentMethod = void 0;
const graphql_1 = __webpack_require__(7);
var ServicePaymentMethod;
(function (ServicePaymentMethod) {
    ServicePaymentMethod["CashCredit"] = "CashCredit";
    ServicePaymentMethod["OnlyCredit"] = "OnlyCredit";
    ServicePaymentMethod["OnlyCash"] = "OnlyCash";
})(ServicePaymentMethod || (exports.ServicePaymentMethod = ServicePaymentMethod = {}));
(0, graphql_1.registerEnumType)(ServicePaymentMethod, { name: 'ServicePaymentMethod' });


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const polygon_transformer_1 = __webpack_require__(58);
const service_entity_1 = __webpack_require__(52);
let RegionEntity = class RegionEntity {
};
exports.RegionEntity = RegionEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RegionEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], RegionEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: 3 }),
    tslib_1.__metadata("design:type", String)
], RegionEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: true
    }),
    tslib_1.__metadata("design:type", Boolean)
], RegionEntity.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("polygon", {
        transformer: new polygon_transformer_1.PolygonTransformer()
    }),
    tslib_1.__metadata("design:type", Array)
], RegionEntity.prototype, "location", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.ServiceEntity, service => service.regions),
    tslib_1.__metadata("design:type", Array)
], RegionEntity.prototype, "services", void 0);
exports.RegionEntity = RegionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('region')
], RegionEntity);


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolygonTransformer = void 0;
class PolygonTransformer {
    to(value) {
        if (value == null)
            return null;
        const str = value.map((x) => {
            const ar = x.map((y) => `${y.lng} ${y.lat}`);
            return ar.join(',');
        }).join('),(');
        return `POLYGON((${str}))`;
    }
    from(value) {
        if (value == null || value == undefined) {
            return [];
        }
        return value.substring(8, value.length - 1).split('),(').map(x => {
            const res = x.substring(1, x.length - 1).split(',').map(y => {
                const s = y.split(' ');
                return {
                    lng: parseFloat(s[0]),
                    lat: parseFloat(s[1])
                };
            });
            return res;
        });
    }
}
exports.PolygonTransformer = PolygonTransformer;


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceCategoryEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const service_entity_1 = __webpack_require__(52);
let ServiceCategoryEntity = class ServiceCategoryEntity {
};
exports.ServiceCategoryEntity = ServiceCategoryEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ServiceCategoryEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'title' }),
    tslib_1.__metadata("design:type", String)
], ServiceCategoryEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => service_entity_1.ServiceEntity, service => service.category),
    tslib_1.__metadata("design:type", Array)
], ServiceCategoryEntity.prototype, "services", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], ServiceCategoryEntity.prototype, "deletedAt", void 0);
exports.ServiceCategoryEntity = ServiceCategoryEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('service_category')
], ServiceCategoryEntity);


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOptionEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const service_option_icon_enum_1 = __webpack_require__(61);
const service_option_type_enum_1 = __webpack_require__(62);
const request_entity_1 = __webpack_require__(23);
const service_entity_1 = __webpack_require__(52);
let ServiceOptionEntity = class ServiceOptionEntity {
};
exports.ServiceOptionEntity = ServiceOptionEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ServiceOptionEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], ServiceOptionEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], ServiceOptionEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: service_option_type_enum_1.ServiceOptionType,
    }),
    tslib_1.__metadata("design:type", String)
], ServiceOptionEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 12,
        scale: 2,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceOptionEntity.prototype, "additionalFee", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: service_option_icon_enum_1.ServiceOptionIcon,
    }),
    tslib_1.__metadata("design:type", String)
], ServiceOptionEntity.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.ServiceEntity, (service) => service.options),
    tslib_1.__metadata("design:type", service_entity_1.ServiceEntity)
], ServiceOptionEntity.prototype, "services", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => request_entity_1.RequestEntity, (request) => request.options),
    tslib_1.__metadata("design:type", Array)
], ServiceOptionEntity.prototype, "requests", void 0);
exports.ServiceOptionEntity = ServiceOptionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('service_option')
], ServiceOptionEntity);


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOptionIcon = void 0;
const graphql_1 = __webpack_require__(7);
var ServiceOptionIcon;
(function (ServiceOptionIcon) {
    ServiceOptionIcon["Pet"] = "Pet";
    ServiceOptionIcon["TwoWay"] = "TwoWay";
    ServiceOptionIcon["Luggage"] = "Luggage";
    ServiceOptionIcon["PackageDelivery"] = "PackageDelivery";
    ServiceOptionIcon["Shopping"] = "Shopping";
    ServiceOptionIcon["Custom1"] = "Custom1";
    ServiceOptionIcon["Custom2"] = "Custom2";
    ServiceOptionIcon["Custom3"] = "Custom3";
    ServiceOptionIcon["Custom4"] = "Custom4";
    ServiceOptionIcon["Custom5"] = "Custom5";
})(ServiceOptionIcon || (exports.ServiceOptionIcon = ServiceOptionIcon = {}));
(0, graphql_1.registerEnumType)(ServiceOptionIcon, { name: 'ServiceOptionIcon' });


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOptionType = void 0;
const graphql_1 = __webpack_require__(7);
var ServiceOptionType;
(function (ServiceOptionType) {
    ServiceOptionType["Free"] = "Free";
    ServiceOptionType["Paid"] = "Paid";
    ServiceOptionType["TwoWay"] = "TwoWay";
})(ServiceOptionType || (exports.ServiceOptionType = ServiceOptionType = {}));
(0, graphql_1.registerEnumType)(ServiceOptionType, { name: 'ServiceOptionType' });


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZonePriceEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const polygon_transformer_1 = __webpack_require__(58);
const time_multiplier_transformer_1 = __webpack_require__(54);
const fleet_entity_1 = __webpack_require__(64);
const service_entity_1 = __webpack_require__(52);
let ZonePriceEntity = class ZonePriceEntity {
};
exports.ZonePriceEntity = ZonePriceEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ZonePriceEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], ZonePriceEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("polygon", {
        transformer: new polygon_transformer_1.PolygonTransformer()
    }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceEntity.prototype, "from", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("polygon", {
        transformer: new polygon_transformer_1.PolygonTransformer()
    }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceEntity.prototype, "to", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2
    }),
    tslib_1.__metadata("design:type", Number)
], ZonePriceEntity.prototype, "cost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('simple-array', {
        nullable: true,
        transformer: new time_multiplier_transformer_1.TimeMultiplierTransformer()
    }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceEntity.prototype, "timeMultipliers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => fleet_entity_1.FleetEntity, fleet => fleet.zonePrices),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], ZonePriceEntity.prototype, "fleets", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.ServiceEntity, service => service.zonePrices),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], ZonePriceEntity.prototype, "services", void 0);
exports.ZonePriceEntity = ZonePriceEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('zone_price')
], ZonePriceEntity);


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const polygon_transformer_1 = __webpack_require__(58);
const driver_entity_1 = __webpack_require__(13);
const fleet_device_entity_1 = __webpack_require__(65);
const fleet_transaction_entity_1 = __webpack_require__(67);
const fleet_wallet_entity_1 = __webpack_require__(68);
const operator_entity_1 = __webpack_require__(19);
const request_entity_1 = __webpack_require__(23);
const zone_price_entity_1 = __webpack_require__(63);
let FleetEntity = class FleetEntity {
};
exports.FleetEntity = FleetEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], FleetEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], FleetEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('bigint'),
    tslib_1.__metadata("design:type", String)
], FleetEntity.prototype, "phoneNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], FleetEntity.prototype, "accountNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('bigint'),
    tslib_1.__metadata("design:type", String)
], FleetEntity.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('tinyint', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], FleetEntity.prototype, "commissionSharePercent", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', { default: 0 }),
    tslib_1.__metadata("design:type", Number)
], FleetEntity.prototype, "commissionShareFlat", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    tslib_1.__metadata("design:type", String)
], FleetEntity.prototype, "address", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], FleetEntity.prototype, "userName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], FleetEntity.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        precision: 10,
        scale: 2,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], FleetEntity.prototype, "feeMultiplier", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('polygon', {
        transformer: new polygon_transformer_1.PolygonTransformer(),
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Array)
], FleetEntity.prototype, "exclusivityAreas", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_entity_1.DriverEntity, (driver) => driver.fleet),
    tslib_1.__metadata("design:type", Array)
], FleetEntity.prototype, "drivers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => fleet_wallet_entity_1.FleetWalletEntity, (wallet) => wallet.fleet),
    tslib_1.__metadata("design:type", Array)
], FleetEntity.prototype, "wallet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => fleet_transaction_entity_1.FleetTransactionEntity, (fleetTransaction) => fleetTransaction.fleet, { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }),
    tslib_1.__metadata("design:type", Array)
], FleetEntity.prototype, "transactions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => operator_entity_1.OperatorEntity, (operator) => operator.fleet),
    tslib_1.__metadata("design:type", Array)
], FleetEntity.prototype, "operators", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => zone_price_entity_1.ZonePriceEntity, (zonePrice) => zonePrice.fleets),
    tslib_1.__metadata("design:type", zone_price_entity_1.ZonePriceEntity)
], FleetEntity.prototype, "zonePrices", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => fleet_device_entity_1.FleetDeviceEntity, (fleetDevice) => fleetDevice.fleet),
    tslib_1.__metadata("design:type", Array)
], FleetEntity.prototype, "devices", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (request) => request.fleet),
    tslib_1.__metadata("design:type", Array)
], FleetEntity.prototype, "requests", void 0);
exports.FleetEntity = FleetEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('fleet')
], FleetEntity);


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetDeviceEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const device_platform_enum_1 = __webpack_require__(66);
const fleet_entity_1 = __webpack_require__(64);
let FleetDeviceEntity = class FleetDeviceEntity {
};
exports.FleetDeviceEntity = FleetDeviceEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], FleetDeviceEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: device_platform_enum_1.DevicePlatform,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], FleetDeviceEntity.prototype, "devicePlatform", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], FleetDeviceEntity.prototype, "deviceName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], FleetDeviceEntity.prototype, "ipAddress", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], FleetDeviceEntity.prototype, "jwt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], FleetDeviceEntity.prototype, "lastSeenAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], FleetDeviceEntity.prototype, "isTerminated", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => fleet_entity_1.FleetEntity, (fleet) => fleet.devices),
    tslib_1.__metadata("design:type", fleet_entity_1.FleetEntity)
], FleetDeviceEntity.prototype, "fleet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], FleetDeviceEntity.prototype, "fleetId", void 0);
exports.FleetDeviceEntity = FleetDeviceEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('fleet_device')
], FleetDeviceEntity);


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DevicePlatform = void 0;
const graphql_1 = __webpack_require__(7);
var DevicePlatform;
(function (DevicePlatform) {
    DevicePlatform["Android"] = "ANDROID";
    DevicePlatform["Ios"] = "IOS";
    DevicePlatform["Web"] = "WEB";
    DevicePlatform["MacOS"] = "MACOS";
    DevicePlatform["Windows"] = "WINDOWS";
    DevicePlatform["Linux"] = "LINUX";
})(DevicePlatform || (exports.DevicePlatform = DevicePlatform = {}));
(0, graphql_1.registerEnumType)(DevicePlatform, { name: 'DevicePlatform' });


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetTransactionEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_entity_1 = __webpack_require__(13);
const provider_deduct_transaction_type_enum_1 = __webpack_require__(41);
const provider_recharge_transaction_type_enum_1 = __webpack_require__(42);
const transaction_action_enum_1 = __webpack_require__(17);
const fleet_entity_1 = __webpack_require__(64);
const operator_entity_1 = __webpack_require__(19);
const request_entity_1 = __webpack_require__(23);
let FleetTransactionEntity = class FleetTransactionEntity {
};
exports.FleetTransactionEntity = FleetTransactionEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'transactionTime' }),
    tslib_1.__metadata("design:type", Date)
], FleetTransactionEntity.prototype, "transactionTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', { enum: transaction_action_enum_1.TransactionAction }),
    tslib_1.__metadata("design:type", String)
], FleetTransactionEntity.prototype, "action", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType,
        nullable: true
    }),
    tslib_1.__metadata("design:type", String)
], FleetTransactionEntity.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType,
        nullable: true
    }),
    tslib_1.__metadata("design:type", String)
], FleetTransactionEntity.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2
    }),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionEntity.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: '3' }),
    tslib_1.__metadata("design:type", String)
], FleetTransactionEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'documentNumber' }),
    tslib_1.__metadata("design:type", String)
], FleetTransactionEntity.prototype, "refrenceNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'details' }),
    tslib_1.__metadata("design:type", String)
], FleetTransactionEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, order => order.fleetTransactions),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], FleetTransactionEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionEntity.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, driver => driver.fleetTransactions),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], FleetTransactionEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionEntity.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => fleet_entity_1.FleetEntity, fleet => fleet.transactions),
    tslib_1.__metadata("design:type", fleet_entity_1.FleetEntity)
], FleetTransactionEntity.prototype, "fleet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionEntity.prototype, "fleetId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, operator => operator.fleetTransactions),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], FleetTransactionEntity.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'operatorId' }),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionEntity.prototype, "operatorId", void 0);
exports.FleetTransactionEntity = FleetTransactionEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('fleet_transaction')
], FleetTransactionEntity);


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetWalletEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const fleet_entity_1 = __webpack_require__(64);
let FleetWalletEntity = class FleetWalletEntity {
};
exports.FleetWalletEntity = FleetWalletEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], FleetWalletEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0.0,
        name: 'amount'
    }),
    tslib_1.__metadata("design:type", Number)
], FleetWalletEntity.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], FleetWalletEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => fleet_entity_1.FleetEntity, fleet => fleet.wallet),
    tslib_1.__metadata("design:type", fleet_entity_1.FleetEntity)
], FleetWalletEntity.prototype, "fleet", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], FleetWalletEntity.prototype, "fleetId", void 0);
exports.FleetWalletEntity = FleetWalletEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('fleet_wallet')
], FleetWalletEntity);


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WeekdayMultiplierTransformer = void 0;
class WeekdayMultiplierTransformer {
    to(value) {
        if (value == null) {
            return [];
        }
        return value.map((row) => `${row.weekday}|${row.multiply}`);
    }
    from(value) {
        if (value == null) {
            return [];
        }
        return value.map((str) => {
            return {
                weekday: str.split('|')[0],
                multiply: parseFloat(str.split('|')[1]),
            };
        });
    }
}
exports.WeekdayMultiplierTransformer = WeekdayMultiplierTransformer;


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateRangeMultiplierTransformer = void 0;
class DateRangeMultiplierTransformer {
    to(value) {
        if (value == null) {
            return [];
        }
        return value.map((row) => `${row.startDate}-${row.endDate}|${row.multiply}`);
    }
    from(value) {
        if (value == null) {
            return [];
        }
        return value.map((str) => {
            return {
                startDate: parseInt(str.split('|')[0].split('-')[0]),
                endDate: parseInt(str.split('|')[0].split('-')[1]),
                multiply: parseFloat(str.split('|')[1]),
            };
        });
    }
}
exports.DateRangeMultiplierTransformer = DateRangeMultiplierTransformer;


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderAddressEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const point_1 = __webpack_require__(72);
const point_transformer_1 = __webpack_require__(73);
const rider_address_type_enum_1 = __webpack_require__(74);
const rider_entity_1 = __webpack_require__(26);
let RiderAddressEntity = class RiderAddressEntity {
};
exports.RiderAddressEntity = RiderAddressEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RiderAddressEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: rider_address_type_enum_1.RiderAddressType,
        default: rider_address_type_enum_1.RiderAddressType.Other
    }),
    tslib_1.__metadata("design:type", String)
], RiderAddressEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], RiderAddressEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'address' }),
    tslib_1.__metadata("design:type", String)
], RiderAddressEntity.prototype, "details", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('point', {
        transformer: new point_transformer_1.PointTransformer()
    }),
    tslib_1.__metadata("design:type", point_1.Point)
], RiderAddressEntity.prototype, "location", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => rider_entity_1.RiderEntity, rider => rider.addresses),
    tslib_1.__metadata("design:type", rider_entity_1.RiderEntity)
], RiderAddressEntity.prototype, "rider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RiderAddressEntity.prototype, "riderId", void 0);
exports.RiderAddressEntity = RiderAddressEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('rider_address')
], RiderAddressEntity);


/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Point = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let Point = class Point {
};
exports.Point = Point;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    tslib_1.__metadata("design:type", Number)
], Point.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    tslib_1.__metadata("design:type", Number)
], Point.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Point.prototype, "heading", void 0);
exports.Point = Point = tslib_1.__decorate([
    (0, graphql_1.ObjectType)(),
    (0, graphql_1.InputType)('PointInput')
], Point);


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointTransformer = void 0;
class PointTransformer {
    to(value) {
        if (value == null)
            return null;
        return `POINT(${value.lng} ${value.lat})`;
    }
    from(value) {
        if (value == null || value == '') {
            return null;
        }
        const a = value.substring(6, value.length - 1).split(' ');
        return {
            lng: parseFloat(a[0]),
            lat: parseFloat(a[1]),
        };
    }
}
exports.PointTransformer = PointTransformer;


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderAddressType = void 0;
const graphql_1 = __webpack_require__(7);
var RiderAddressType;
(function (RiderAddressType) {
    RiderAddressType["Home"] = "Home";
    RiderAddressType["Work"] = "Work";
    RiderAddressType["Partner"] = "Partner";
    RiderAddressType["Gym"] = "Gym";
    RiderAddressType["Parent"] = "Parent";
    RiderAddressType["Cafe"] = "Cafe";
    RiderAddressType["Park"] = "Park";
    RiderAddressType["Other"] = "Other";
})(RiderAddressType || (exports.RiderAddressType = RiderAddressType = {}));
(0, graphql_1.registerEnumType)(RiderAddressType, { name: 'RiderAddressType' });


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderWalletEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const rider_entity_1 = __webpack_require__(26);
let RiderWalletEntity = class RiderWalletEntity {
};
exports.RiderWalletEntity = RiderWalletEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RiderWalletEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0.0,
        name: 'amount'
    }),
    tslib_1.__metadata("design:type", Number)
], RiderWalletEntity.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: 3 }),
    tslib_1.__metadata("design:type", String)
], RiderWalletEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => rider_entity_1.RiderEntity, rider => rider.wallets),
    tslib_1.__metadata("design:type", rider_entity_1.RiderEntity)
], RiderWalletEntity.prototype, "rider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RiderWalletEntity.prototype, "riderId", void 0);
exports.RiderWalletEntity = RiderWalletEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('rider_wallet')
], RiderWalletEntity);


/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderReviewEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const rider_entity_1 = __webpack_require__(26);
const driver_entity_1 = __webpack_require__(13);
const request_entity_1 = __webpack_require__(23);
let RiderReviewEntity = class RiderReviewEntity {
};
exports.RiderReviewEntity = RiderReviewEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RiderReviewEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('tinyint'),
    tslib_1.__metadata("design:type", Number)
], RiderReviewEntity.prototype, "score", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'review', nullable: true }),
    tslib_1.__metadata("design:type", String)
], RiderReviewEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => rider_entity_1.RiderEntity, (rider) => rider.reviewsForRider),
    tslib_1.__metadata("design:type", rider_entity_1.RiderEntity)
], RiderReviewEntity.prototype, "rider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RiderReviewEntity.prototype, "riderId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.reviewsByDriver),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], RiderReviewEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RiderReviewEntity.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], RiderReviewEntity.prototype, "reviewTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => request_entity_1.RequestEntity, (order) => order.driverReviewForRider),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], RiderReviewEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RiderReviewEntity.prototype, "orderId", void 0);
exports.RiderReviewEntity = RiderReviewEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('rider_review')
], RiderReviewEntity);


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderStatus = void 0;
const graphql_1 = __webpack_require__(7);
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Requested"] = "Requested";
    OrderStatus["NotFound"] = "NotFound";
    OrderStatus["NoCloseFound"] = "NoCloseFound";
    OrderStatus["Found"] = "Found";
    OrderStatus["DriverAccepted"] = "DriverAccepted";
    OrderStatus["Arrived"] = "Arrived";
    OrderStatus["WaitingForPrePay"] = "WaitingForPrePay";
    OrderStatus["DriverCanceled"] = "DriverCanceled";
    OrderStatus["RiderCanceled"] = "RiderCanceled";
    OrderStatus["Started"] = "Started";
    OrderStatus["WaitingForPostPay"] = "WaitingForPostPay";
    OrderStatus["WaitingForReview"] = "WaitingForReview";
    OrderStatus["Finished"] = "Finished";
    OrderStatus["Booked"] = "Booked";
    OrderStatus["Expired"] = "Expired";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
(0, graphql_1.registerEnumType)(OrderStatus, { name: 'OrderStatus' });


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_entity_1 = __webpack_require__(13);
const feedback_parameter_entity_1 = __webpack_require__(79);
const request_entity_1 = __webpack_require__(23);
let FeedbackEntity = class FeedbackEntity {
};
exports.FeedbackEntity = FeedbackEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], FeedbackEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], FeedbackEntity.prototype, "reviewTimestamp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('tinyint'),
    tslib_1.__metadata("design:type", Number)
], FeedbackEntity.prototype, "score", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'review', nullable: true }),
    tslib_1.__metadata("design:type", String)
], FeedbackEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.feedbacks),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], FeedbackEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], FeedbackEntity.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => request_entity_1.RequestEntity, (order) => order.review),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], FeedbackEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], FeedbackEntity.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => feedback_parameter_entity_1.FeedbackParameterEntity, (feedbackParameter) => feedbackParameter.feedbacks),
    tslib_1.__metadata("design:type", Array)
], FeedbackEntity.prototype, "parameters", void 0);
exports.FeedbackEntity = FeedbackEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('request_review')
], FeedbackEntity);


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackParameterEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const feedback_entity_1 = __webpack_require__(78);
let FeedbackParameterEntity = class FeedbackParameterEntity {
};
exports.FeedbackParameterEntity = FeedbackParameterEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], FeedbackParameterEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], FeedbackParameterEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], FeedbackParameterEntity.prototype, "isGood", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => feedback_entity_1.FeedbackEntity, feedback => feedback.parameters),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], FeedbackParameterEntity.prototype, "feedbacks", void 0);
exports.FeedbackParameterEntity = FeedbackParameterEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('review_parameter')
], FeedbackParameterEntity);


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderMessageEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const message_status_enum_1 = __webpack_require__(81);
const request_entity_1 = __webpack_require__(23);
let OrderMessageEntity = class OrderMessageEntity {
};
exports.OrderMessageEntity = OrderMessageEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], OrderMessageEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], OrderMessageEntity.prototype, "sentAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], OrderMessageEntity.prototype, "sentByDriver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'state',
        enum: message_status_enum_1.MessageStatus,
        default: message_status_enum_1.MessageStatus.Sent
    }),
    tslib_1.__metadata("design:type", String)
], OrderMessageEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], OrderMessageEntity.prototype, "content", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, order => order.conversation),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], OrderMessageEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], OrderMessageEntity.prototype, "requestId", void 0);
exports.OrderMessageEntity = OrderMessageEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('request_chat')
], OrderMessageEntity);


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageStatus = void 0;
const graphql_1 = __webpack_require__(7);
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["Sent"] = "sent";
    MessageStatus["Delivered"] = "delivered";
    MessageStatus["Seen"] = "seen";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
(0, graphql_1.registerEnumType)(MessageStatus, { name: 'MessageStatus' });


/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestActivityEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const request_activity_type_enum_1 = __webpack_require__(83);
const request_entity_1 = __webpack_require__(23);
let RequestActivityEntity = class RequestActivityEntity {
};
exports.RequestActivityEntity = RequestActivityEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], RequestActivityEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: request_activity_type_enum_1.RequestActivityType
    }),
    tslib_1.__metadata("design:type", String)
], RequestActivityEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], RequestActivityEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, (request) => request.activities),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], RequestActivityEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], RequestActivityEntity.prototype, "requestId", void 0);
exports.RequestActivityEntity = RequestActivityEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('request_activity')
], RequestActivityEntity);


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestActivityType = void 0;
const graphql_1 = __webpack_require__(7);
var RequestActivityType;
(function (RequestActivityType) {
    RequestActivityType["RequestedByOperator"] = "RequestedByOperator";
    RequestActivityType["BookedByOperator"] = "BookedByOperator";
    RequestActivityType["RequestedByRider"] = "RequestedByRider";
    RequestActivityType["BookedByRider"] = "BookedByRider";
    RequestActivityType["DriverAccepted"] = "DriverAccepted";
    RequestActivityType["ArrivedToPickupPoint"] = "ArrivedToPickupPoint";
    RequestActivityType["CanceledByDriver"] = "CanceledByDriver";
    RequestActivityType["CanceledByRider"] = "CanceledByRider";
    RequestActivityType["CanceledByOperator"] = "CanceledByOperator";
    RequestActivityType["Started"] = "Started";
    RequestActivityType["ArrivedToDestination"] = "ArrivedToDestination";
    RequestActivityType["Paid"] = "Paid";
    RequestActivityType["Reviewed"] = "Reviewed";
    RequestActivityType["Expired"] = "Expired";
})(RequestActivityType || (exports.RequestActivityType = RequestActivityType = {}));
(0, graphql_1.registerEnumType)(RequestActivityType, { name: 'RequestActivityType' });


/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const point_1 = __webpack_require__(72);
const point_transformer_1 = __webpack_require__(73);
const sos_status_enum_1 = __webpack_require__(85);
const request_entity_1 = __webpack_require__(23);
const sos_activity_entity_1 = __webpack_require__(86);
let SOSEntity = class SOSEntity {
};
exports.SOSEntity = SOSEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], SOSEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], SOSEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: sos_status_enum_1.SOSStatus,
        default: sos_status_enum_1.SOSStatus.Submitted
    }),
    tslib_1.__metadata("design:type", String)
], SOSEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('point', {
        transformer: new point_transformer_1.PointTransformer(),
        nullable: true
    }),
    tslib_1.__metadata("design:type", point_1.Point)
], SOSEntity.prototype, "location", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.RequestEntity, request => request.sosCalls),
    tslib_1.__metadata("design:type", request_entity_1.RequestEntity)
], SOSEntity.prototype, "request", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], SOSEntity.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], SOSEntity.prototype, "submittedByRider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => sos_activity_entity_1.SOSActivityEntity, activity => activity.sos),
    tslib_1.__metadata("design:type", Array)
], SOSEntity.prototype, "activities", void 0);
exports.SOSEntity = SOSEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('sos')
], SOSEntity);


/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSStatus = void 0;
const graphql_1 = __webpack_require__(7);
var SOSStatus;
(function (SOSStatus) {
    SOSStatus["Submitted"] = "Submitted";
    SOSStatus["UnderReview"] = "UnderReview";
    SOSStatus["FalseAlarm"] = "FalseAlarm";
    SOSStatus["Resolved"] = "Resolved";
})(SOSStatus || (exports.SOSStatus = SOSStatus = {}));
(0, graphql_1.registerEnumType)(SOSStatus, { name: 'SOSStatus' });


/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSActivityEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const sos_activity_action_enum_1 = __webpack_require__(87);
const operator_entity_1 = __webpack_require__(19);
const sos_entity_1 = __webpack_require__(84);
let SOSActivityEntity = class SOSActivityEntity {
};
exports.SOSActivityEntity = SOSActivityEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], SOSActivityEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], SOSActivityEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: sos_activity_action_enum_1.SOSActivityAction,
    }),
    tslib_1.__metadata("design:type", String)
], SOSActivityEntity.prototype, "action", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        length: 2000
    }),
    tslib_1.__metadata("design:type", String)
], SOSActivityEntity.prototype, "note", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => operator_entity_1.OperatorEntity, operator => operator.sosActivities),
    tslib_1.__metadata("design:type", operator_entity_1.OperatorEntity)
], SOSActivityEntity.prototype, "operator", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], SOSActivityEntity.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => sos_entity_1.SOSEntity, sos => sos.activities),
    tslib_1.__metadata("design:type", sos_entity_1.SOSEntity)
], SOSActivityEntity.prototype, "sos", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], SOSActivityEntity.prototype, "sosId", void 0);
exports.SOSActivityEntity = SOSActivityEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('sos_activity')
], SOSActivityEntity);


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSActivityAction = void 0;
const graphql_1 = __webpack_require__(7);
var SOSActivityAction;
(function (SOSActivityAction) {
    SOSActivityAction["Submitted"] = "Submitted";
    SOSActivityAction["Seen"] = "Seen";
    SOSActivityAction["ContactDriver"] = "ContactDriver";
    SOSActivityAction["ContactAuthorities"] = "ContactAuthorities";
    SOSActivityAction["MarkedAsResolved"] = "MarkedAsResolved";
    SOSActivityAction["MarkedAsFalseAlarm"] = "MarkedAsFalseAlarm";
})(SOSActivityAction || (exports.SOSActivityAction = SOSActivityAction = {}));
(0, graphql_1.registerEnumType)(SOSActivityAction, { name: 'SOSActivityAction' });


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderCancelReasonEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const request_entity_1 = __webpack_require__(23);
const anouncement_user_type_enum_1 = __webpack_require__(32);
let OrderCancelReasonEntity = class OrderCancelReasonEntity {
};
exports.OrderCancelReasonEntity = OrderCancelReasonEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], OrderCancelReasonEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], OrderCancelReasonEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.RequestEntity, (request) => request.cancelReason),
    tslib_1.__metadata("design:type", Array)
], OrderCancelReasonEntity.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        default: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], OrderCancelReasonEntity.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: anouncement_user_type_enum_1.AnnouncementUserType,
        default: anouncement_user_type_enum_1.AnnouncementUserType.Rider,
        //nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], OrderCancelReasonEntity.prototype, "userType", void 0);
exports.OrderCancelReasonEntity = OrderCancelReasonEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('order_cancel_reason')
], OrderCancelReasonEntity);


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentMode = void 0;
const graphql_1 = __webpack_require__(7);
var PaymentMode;
(function (PaymentMode) {
    PaymentMode["Cash"] = "cash";
    PaymentMode["SavedPaymentMethod"] = "savedPaymentMethod";
    PaymentMode["PaymentGateway"] = "paymentGateway";
    PaymentMode["Wallet"] = "wallet";
})(PaymentMode || (exports.PaymentMode = PaymentMode = {}));
(0, graphql_1.registerEnumType)(PaymentMode, {
    name: 'PaymentMode',
    description: 'The means of payment for an order.',
});


/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleType = void 0;
// libs/database/src/lib/entities/enums/vehicle-type.enum.ts
var VehicleType;
(function (VehicleType) {
    VehicleType["Pickup"] = "pickup";
    VehicleType["Van"] = "van";
    VehicleType["Truck"] = "truck";
    VehicleType["CoveredTruck"] = "covered-truck";
})(VehicleType || (exports.VehicleType = VehicleType = {}));


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintActivityType = void 0;
const graphql_1 = __webpack_require__(7);
var ComplaintActivityType;
(function (ComplaintActivityType) {
    ComplaintActivityType["AssignToOperator"] = "AssignedToOperator";
    ComplaintActivityType["Update"] = "Update";
    ComplaintActivityType["Resolved"] = "Resolved";
})(ComplaintActivityType || (exports.ComplaintActivityType = ComplaintActivityType = {}));
(0, graphql_1.registerEnumType)(ComplaintActivityType, { name: 'ComplaintActivityType' });


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnabledNotification = void 0;
var EnabledNotification;
(function (EnabledNotification) {
    EnabledNotification["SOS"] = "sos";
    EnabledNotification["Complaint"] = "complaint";
    EnabledNotification["Order"] = "order";
    EnabledNotification["DriverSubmittedDocs"] = "driverSubmittedDocs";
})(EnabledNotification || (exports.EnabledNotification = EnabledNotification = {}));


/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorRoleEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const operator_permission_enum_1 = __webpack_require__(94);
const operator_entity_1 = __webpack_require__(19);
let OperatorRoleEntity = class OperatorRoleEntity {
};
exports.OperatorRoleEntity = OperatorRoleEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], OperatorRoleEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], OperatorRoleEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('set', {
        enum: operator_permission_enum_1.OperatorPermission,
    }),
    tslib_1.__metadata("design:type", Array)
], OperatorRoleEntity.prototype, "permissions", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => operator_entity_1.OperatorEntity, (operator) => operator.role),
    tslib_1.__metadata("design:type", Array)
], OperatorRoleEntity.prototype, "operators", void 0);
exports.OperatorRoleEntity = OperatorRoleEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('operator_role')
], OperatorRoleEntity);


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorPermission = void 0;
const graphql_1 = __webpack_require__(7);
var OperatorPermission;
(function (OperatorPermission) {
    OperatorPermission["Drivers_View"] = "Drivers_View";
    OperatorPermission["Drivers_Edit"] = "Drivers_Edit";
    OperatorPermission["Riders_View"] = "Riders_View";
    OperatorPermission["Riders_Edit"] = "Riders_Edit";
    OperatorPermission["Regions_View"] = "Regions_View";
    OperatorPermission["Regions_Edit"] = "Regions_Edit";
    OperatorPermission["Services_View"] = "Services_View";
    OperatorPermission["Services_Edit"] = "Services_Edit";
    OperatorPermission["Complaints_View"] = "Complaints_View";
    OperatorPermission["Complaints_Edit"] = "Complaints_Edit";
    OperatorPermission["Coupons_View"] = "Coupons_View";
    OperatorPermission["Coupons_Edit"] = "Coupons_Edit";
    OperatorPermission["Announcements_View"] = "Announcements_View";
    OperatorPermission["Announcements_Edit"] = "Announcements_Edit";
    OperatorPermission["Requests_View"] = "Requests_View";
    OperatorPermission["Fleets_View"] = "Fleets_View";
    OperatorPermission["Fleets_Edit"] = "Fleets_Edit";
    OperatorPermission["Gateways_View"] = "Gateways_View";
    OperatorPermission["Gateways_Edit"] = "Gateways_Edit";
    OperatorPermission["Users_View"] = "Users_View";
    OperatorPermission["Users_Edit"] = "Users_Edit";
    OperatorPermission["Cars_View"] = "Cars_View";
    OperatorPermission["Cars_Edit"] = "Cars_Edit";
    OperatorPermission["FleetWallet_View"] = "FleetWallet_View";
    OperatorPermission["FleetWallet_Edit"] = "FleetWallet_Edit";
    OperatorPermission["ProviderWallet_View"] = "ProviderWallet_View";
    OperatorPermission["ProviderWallet_Edit"] = "ProviderWallet_Edit";
    OperatorPermission["DriverWallet_View"] = "DriverWallet_View";
    OperatorPermission["DriverWallet_Edit"] = "DriverWallet_Edit";
    OperatorPermission["RiderWallet_View"] = "RiderWallet_View";
    OperatorPermission["RiderWallet_Edit"] = "RiderWallet_Edit";
    OperatorPermission["ReviewParameter_Edit"] = "ReviewParameter_Edit";
    OperatorPermission["Payouts_View"] = "Payouts_View";
    OperatorPermission["Payouts_Edit"] = "Payouts_Edit";
    OperatorPermission["GiftBatch_View"] = "GiftBatch_View";
    OperatorPermission["GiftBatch_Create"] = "GiftBatch_Create";
    OperatorPermission["GiftBatch_ViewCodes"] = "GiftBatch_ViewCodes";
    OperatorPermission["SMSProviders_View"] = "SMSProviders_View";
    OperatorPermission["SMSProviders_Edit"] = "SMSProviders_Edit";
})(OperatorPermission || (exports.OperatorPermission = OperatorPermission = {}));
(0, graphql_1.registerEnumType)(OperatorPermission, { name: 'OperatorPermission' });


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverWalletEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_entity_1 = __webpack_require__(13);
let DriverWalletEntity = class DriverWalletEntity {
};
exports.DriverWalletEntity = DriverWalletEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], DriverWalletEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0.0,
        name: 'amount',
    }),
    tslib_1.__metadata("design:type", Number)
], DriverWalletEntity.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('char', { length: 3 }),
    tslib_1.__metadata("design:type", String)
], DriverWalletEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.DriverEntity, (driver) => driver.wallet, {
        onDelete: 'CASCADE',
    }),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], DriverWalletEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], DriverWalletEntity.prototype, "driverId", void 0);
exports.DriverWalletEntity = DriverWalletEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('driver_wallet')
], DriverWalletEntity);


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverStatus = void 0;
const graphql_1 = __webpack_require__(7);
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["Online"] = "online";
    DriverStatus["Offline"] = "offline";
    DriverStatus["Blocked"] = "blocked";
    DriverStatus["InService"] = "in service";
    DriverStatus["WaitingDocuments"] = "waiting documents";
    DriverStatus["PendingApproval"] = "pending approval";
    DriverStatus["SoftReject"] = "soft reject";
    DriverStatus["HardReject"] = "hard reject";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
(0, graphql_1.registerEnumType)(DriverStatus, { name: 'DriverStatus' });


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleEntity = void 0;
const tslib_1 = __webpack_require__(1);
// libs/database/src/lib/entities/vehicle.entity.ts
const typeorm_1 = __webpack_require__(11);
const vehicle_type_enum_1 = __webpack_require__(90);
const driver_entity_1 = __webpack_require__(13);
const media_entity_1 = __webpack_require__(30); // Optional: If vehicles have photos
let VehicleEntity = class VehicleEntity {
};
exports.VehicleEntity = VehicleEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], VehicleEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], VehicleEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], VehicleEntity.prototype, "plateNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: vehicle_type_enum_1.VehicleType,
        nullable: false, // Vehicle type is mandatory
    }),
    tslib_1.__metadata("design:type", String)
], VehicleEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], VehicleEntity.prototype, "color", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], VehicleEntity.prototype, "productionYear", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], VehicleEntity.prototype, "loadCapacityKg", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => driver_entity_1.DriverEntity, driver => driver.vehicle),
    tslib_1.__metadata("design:type", driver_entity_1.DriverEntity)
], VehicleEntity.prototype, "driver", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.MediaEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", media_entity_1.MediaEntity)
], VehicleEntity.prototype, "media", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], VehicleEntity.prototype, "mediaId", void 0);
exports.VehicleEntity = VehicleEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('vehicle')
], VehicleEntity);


/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarModelEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const driver_entity_1 = __webpack_require__(13);
let CarModelEntity = class CarModelEntity {
};
exports.CarModelEntity = CarModelEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], CarModelEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'title' }),
    tslib_1.__metadata("design:type", String)
], CarModelEntity.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => driver_entity_1.DriverEntity, driver => driver.car),
    tslib_1.__metadata("design:type", Array)
], CarModelEntity.prototype, "drivers", void 0);
exports.CarModelEntity = CarModelEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('car')
], CarModelEntity);


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderWalletEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
let ProviderWalletEntity = class ProviderWalletEntity {
};
exports.ProviderWalletEntity = ProviderWalletEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ProviderWalletEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0.0,
        name: 'amount'
    }),
    tslib_1.__metadata("design:type", Number)
], ProviderWalletEntity.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], ProviderWalletEntity.prototype, "currency", void 0);
exports.ProviderWalletEntity = ProviderWalletEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('admin_wallet')
], ProviderWalletEntity);


/***/ }),
/* 100 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentEntity = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(11);
const Entity_1 = __webpack_require__(101);
const payment_status_enum_1 = __webpack_require__(102);
let PaymentEntity = class PaymentEntity {
};
exports.PaymentEntity = PaymentEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PaymentEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: payment_status_enum_1.PaymentStatus,
        default: payment_status_enum_1.PaymentStatus.Processing,
    }),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('float', {
        default: '0.00',
        precision: 10,
        scale: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], PaymentEntity.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "transactionNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "externalReferenceNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Index)('INDEX_ORDER_NUMBER'),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "orderNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "userType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int'),
    tslib_1.__metadata("design:type", Number)
], PaymentEntity.prototype, "gatewayId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PaymentEntity.prototype, "returnUrl", void 0);
exports.PaymentEntity = PaymentEntity = tslib_1.__decorate([
    (0, Entity_1.Entity)('payment')
], PaymentEntity);


/***/ }),
/* 101 */
/***/ ((module) => {

module.exports = require("typeorm/decorator/entity/Entity");

/***/ }),
/* 102 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Processing"] = "processing";
    PaymentStatus["Authorized"] = "authorized";
    PaymentStatus["Success"] = "success";
    PaymentStatus["Canceled"] = "canceled";
    PaymentStatus["Failed"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisPubSubProvider = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_redis_subscriptions_1 = __webpack_require__(105);
const ioredis_1 = tslib_1.__importDefault(__webpack_require__(106));
class RedisPubSubProvider {
    static provider() {
        return {
            provide: (0, nestjs_query_graphql_1.pubSubToken)(),
            useFactory: () => {
                const options = {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: 6379
                };
                return new graphql_redis_subscriptions_1.RedisPubSub({
                    publisher: new ioredis_1.default(options),
                    subscriber: new ioredis_1.default(options),
                });
            },
        };
    }
}
exports.RedisPubSubProvider = RedisPubSubProvider;


/***/ }),
/* 104 */
/***/ ((module) => {

module.exports = require("@ptc-org/nestjs-query-graphql");

/***/ }),
/* 105 */
/***/ ((module) => {

module.exports = require("graphql-redis-subscriptions");

/***/ }),
/* 106 */
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CryptoService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const crypto_1 = __webpack_require__(108);
let CryptoService = class CryptoService {
    constructor() {
        this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
        this.IV_LENGTH = 16; // For AES, this is always 16
    }
    async encrypt(text) {
        const iv = (0, crypto_1.randomBytes)(this.IV_LENGTH);
        const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    async decrypt(text) {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString());
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CryptoService);


/***/ }),
/* 108 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeMultiplier = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let TimeMultiplier = class TimeMultiplier {
    static _GRAPHQL_METADATA_FACTORY() {
        return { startTime: { type: () => String }, endTime: { type: () => String }, multiply: { type: () => Number } };
    }
};
exports.TimeMultiplier = TimeMultiplier;
exports.TimeMultiplier = TimeMultiplier = tslib_1.__decorate([
    (0, graphql_1.InputType)('TimeMultiplierInput'),
    (0, graphql_1.ObjectType)()
], TimeMultiplier);


/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DistanceMultiplier = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let DistanceMultiplier = class DistanceMultiplier {
    static _GRAPHQL_METADATA_FACTORY() {
        return { distanceFrom: { type: () => Number }, distanceTo: { type: () => Number }, multiply: { type: () => Number } };
    }
};
exports.DistanceMultiplier = DistanceMultiplier;
exports.DistanceMultiplier = DistanceMultiplier = tslib_1.__decorate([
    (0, graphql_1.InputType)('DistanceMultiplierInput'),
    (0, graphql_1.ObjectType)()
], DistanceMultiplier);


/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Weekday = exports.WeekdayMultiplier = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(112);
const graphql_1 = __webpack_require__(7);
let WeekdayMultiplier = class WeekdayMultiplier {
    static _GRAPHQL_METADATA_FACTORY() {
        return { weekday: { type: () => (__webpack_require__(112).Weekday) }, multiply: { type: () => Number } };
    }
};
exports.WeekdayMultiplier = WeekdayMultiplier;
exports.WeekdayMultiplier = WeekdayMultiplier = tslib_1.__decorate([
    (0, graphql_1.InputType)('WeekdayMultiplierInput'),
    (0, graphql_1.ObjectType)()
], WeekdayMultiplier);
var Weekday;
(function (Weekday) {
    Weekday["Sunday"] = "Sunday";
    Weekday["Monday"] = "Monday";
    Weekday["Tuesday"] = "Tuesday";
    Weekday["Wednesday"] = "Wednesday";
    Weekday["Thursday"] = "Thursday";
    Weekday["Friday"] = "Friday";
    Weekday["Saturday"] = "Saturday";
})(Weekday || (exports.Weekday = Weekday = {}));
(0, graphql_1.registerEnumType)(Weekday, {
    name: 'Weekday',
});


/***/ }),
/* 113 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateRangeMultiplier = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let DateRangeMultiplier = class DateRangeMultiplier {
    static _GRAPHQL_METADATA_FACTORY() {
        return { startDate: { type: () => Number }, endDate: { type: () => Number }, multiply: { type: () => Number } };
    }
};
exports.DateRangeMultiplier = DateRangeMultiplier;
exports.DateRangeMultiplier = DateRangeMultiplier = tslib_1.__decorate([
    (0, graphql_1.InputType)('DateRangeMultiplierInput'),
    (0, graphql_1.ObjectType)()
], DateRangeMultiplier);


/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingEntity = void 0;
const tslib_1 = __webpack_require__(1);
// libs/database/src/lib/entities/setting.entity.ts
const typeorm_1 = __webpack_require__(11);
let SettingEntity = class SettingEntity {
};
exports.SettingEntity = SettingEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)() // Use the setting key as the primary key
    ,
    tslib_1.__metadata("design:type", String)
], SettingEntity.prototype, "key", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text') // Use text to accommodate various value types (string, number, boolean as string, JSON)
    ,
    tslib_1.__metadata("design:type", String)
], SettingEntity.prototype, "value", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], SettingEntity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], SettingEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: 'General' }),
    tslib_1.__metadata("design:type", String)
], SettingEntity.prototype, "group", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], SettingEntity.prototype, "isPublic", void 0);
exports.SettingEntity = SettingEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)('setting')
], SettingEntity);


/***/ }),
/* 115 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeoModule = void 0;
const tslib_1 = __webpack_require__(1);
const axios_1 = __webpack_require__(6);
const common_1 = __webpack_require__(2);
const geo_resolver_1 = __webpack_require__(116);
const google_geo_service_1 = __webpack_require__(119);
const nominitam_geo_service_1 = __webpack_require__(123);
const shared_configuration_service_1 = __webpack_require__(121);
let GeoModule = class GeoModule {
};
exports.GeoModule = GeoModule;
exports.GeoModule = GeoModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: [
            geo_resolver_1.GeoResolver,
            google_geo_service_1.GoogleGeoService,
            nominitam_geo_service_1.NominitamGeoService,
            shared_configuration_service_1.SharedConfigurationService,
        ],
    })
], GeoModule);


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeoResolver = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const place_dto_1 = __webpack_require__(117);
const geo_provider_enum_1 = __webpack_require__(118);
const google_geo_service_1 = __webpack_require__(119);
const nominitam_geo_service_1 = __webpack_require__(123);
const point_1 = __webpack_require__(72);
const shared_configuration_service_1 = __webpack_require__(121);
let GeoResolver = class GeoResolver {
    constructor(googleGeoService, nominitamGeoService, configService) {
        this.googleGeoService = googleGeoService;
        this.nominitamGeoService = nominitamGeoService;
        this.configService = configService;
    }
    async getPlaces(keyword, location, radius, language, provider, apiKey) {
        const serverProvider = process.env.GEO_PROVIDER;
        const configs = await this.configService.getConfiguration();
        const serverApiKey = configs?.backendMapsAPIKey;
        if (serverApiKey == null && apiKey?.length == 0) {
            throw new Error('Invalid API Key');
        }
        if (serverProvider != null) {
            if (serverProvider == 'google') {
                provider = geo_provider_enum_1.GeoProvider.GOOGLE;
            }
            if (serverProvider == 'nominitam') {
                provider = geo_provider_enum_1.GeoProvider.NOMINATIM;
            }
        }
        if (provider === geo_provider_enum_1.GeoProvider.GOOGLE) {
            return this.googleGeoService.getPlaces({
                keyword,
                location,
                radius,
                language,
            });
        }
        else {
            return this.nominitamGeoService.getPlaces({
                keyword,
                location,
                radius,
                language,
            });
        }
    }
    async reverseGeocode(location, language, provider, apiKey) {
        const serverProvider = process.env.GEO_PROVIDER;
        const configs = await this.configService.getConfiguration();
        const serverApiKey = configs?.backendMapsAPIKey;
        if (serverApiKey == null && apiKey?.length == 0) {
            throw new Error('Invalid API Key');
        }
        if (serverProvider != null) {
            if (serverProvider == 'google') {
                provider = geo_provider_enum_1.GeoProvider.GOOGLE;
            }
            if (serverProvider == 'nominitam') {
                provider = geo_provider_enum_1.GeoProvider.NOMINATIM;
            }
        }
        if (provider === geo_provider_enum_1.GeoProvider.GOOGLE) {
            return this.googleGeoService.reverseGeocode({
                lat: location.lat,
                lng: location.lng,
                language,
            });
        }
        else {
            return this.nominitamGeoService.reverseGeocode({
                lat: location.lat,
                lng: location.lng,
                language,
            });
        }
    }
};
exports.GeoResolver = GeoResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [place_dto_1.PlaceDTO]),
    tslib_1.__param(0, (0, graphql_1.Args)('keyword')),
    tslib_1.__param(1, (0, graphql_1.Args)('location', { nullable: true })),
    tslib_1.__param(2, (0, graphql_1.Args)('radius', {
        nullable: true,
        type: () => graphql_1.Int,
        description: 'Search radius from location argument in meters',
    })),
    tslib_1.__param(3, (0, graphql_1.Args)('language', { nullable: true })),
    tslib_1.__param(4, (0, graphql_1.Args)('provider', { nullable: true, type: () => geo_provider_enum_1.GeoProvider })),
    tslib_1.__param(5, (0, graphql_1.Args)('apiKey', { nullable: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, point_1.Point, Number, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], GeoResolver.prototype, "getPlaces", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => place_dto_1.PlaceDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('location')),
    tslib_1.__param(1, (0, graphql_1.Args)('language', { nullable: true })),
    tslib_1.__param(2, (0, graphql_1.Args)('provider', { nullable: true, type: () => geo_provider_enum_1.GeoProvider })),
    tslib_1.__param(3, (0, graphql_1.Args)('apiKey', { nullable: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [point_1.Point, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], GeoResolver.prototype, "reverseGeocode", null);
exports.GeoResolver = GeoResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    tslib_1.__metadata("design:paramtypes", [google_geo_service_1.GoogleGeoService,
        nominitam_geo_service_1.NominitamGeoService,
        shared_configuration_service_1.SharedConfigurationService])
], GeoResolver);


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlaceDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const graphql_1 = __webpack_require__(7);
let PlaceDTO = class PlaceDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { point: { type: () => (__webpack_require__(72).Point) }, title: { nullable: true, type: () => String }, address: { type: () => String } };
    }
};
exports.PlaceDTO = PlaceDTO;
exports.PlaceDTO = PlaceDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], PlaceDTO);


/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeoProvider = void 0;
const graphql_1 = __webpack_require__(7);
var GeoProvider;
(function (GeoProvider) {
    GeoProvider["GOOGLE"] = "google";
    GeoProvider["MAPBOX"] = "mapbox";
    GeoProvider["NOMINATIM"] = "nominatim";
})(GeoProvider || (exports.GeoProvider = GeoProvider = {}));
(0, graphql_1.registerEnumType)(GeoProvider, { name: 'GeoProvider' });


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleGeoService = void 0;
const tslib_1 = __webpack_require__(1);
const google_maps_services_js_1 = __webpack_require__(120);
const common_1 = __webpack_require__(2);
const shared_configuration_service_1 = __webpack_require__(121);
let GoogleGeoService = class GoogleGeoService {
    constructor(configurationService) {
        this.configurationService = configurationService;
        this.googleClient = new google_maps_services_js_1.Client({});
    }
    async getPlaces(input) {
        const config = await this.configurationService.getConfiguration();
        const results = [];
        const response = await this.googleClient.placeQueryAutocomplete({
            params: {
                input: input.keyword,
                location: input.location,
                radius: input.location != null && input.radius != null
                    ? input.radius
                    : undefined,
                language: input.language,
                key: config.backendMapsAPIKey,
            },
        });
        for (let item of response.data.predictions) {
            if (item.place_id == null)
                continue;
            const placeDetails = await this.googleClient.placeDetails({
                params: {
                    place_id: item.place_id,
                    key: config.backendMapsAPIKey,
                },
            });
            if (placeDetails.data.result.geometry?.location.lat == null ||
                placeDetails.data.result.geometry?.location.lng == null ||
                placeDetails.data.result.formatted_address == null)
                continue;
            results.push({
                point: {
                    lat: placeDetails.data.result.geometry.location.lat,
                    lng: placeDetails.data.result.geometry.location.lng,
                },
                title: placeDetails.data.result.name,
                address: placeDetails.data.result.formatted_address,
            });
        }
        // Sort by distance
        results.sort((a, b) => {
            if (input.location == null)
                return 0;
            const aDistance = Math.pow(a.point.lat - input.location.lat, 2) +
                Math.pow(a.point.lng - input.location.lng, 2);
            const bDistance = Math.pow(b.point.lat - input.location.lat, 2) +
                Math.pow(b.point.lng - input.location.lng, 2);
            return aDistance - bDistance;
        });
        // const response = await this.googleClient.textSearch({
        //   params: {
        //     query: input.keyword,
        //     key: config!.backendMapsAPIKey!,
        //   },
        // });
        // if (response.data.results.length == 0) return [];
        // for (let i = 0; i < response.data.results.length; i++) {
        //   results.push({
        //     point: {
        //       lat: response.data.results[i].geometry?.location.lat,
        //       lng: response.data.results[i].geometry?.location.lng,
        //     },
        //     title: response.data.results[i].name,
        //     address: response.data.results[i].formatted_address,
        //   });
        // }
        // const response = await this.googleClient.placeAutocomplete({
        //   params: {
        //     input: input.keyword,
        //     location: input.location,
        //     radius: input.radius,
        //     language: input.language as any,
        //     key: config!.backendMapsAPIKey!,
        //   },
        // });
        // if (response.data.predictions.length == 0) return [];
        // for (let i = 0; i < response.data.predictions.length; i++) {
        //   const geocoding = await this.googleClient.reverseGeocode({
        //     params: {
        //       place_id: response.data.predictions[i].place_id,
        //       key: config!.backendMapsAPIKey!,
        //     },
        //   });
        //   results.push({
        //     point: {
        //       lat: geocoding.data.results[0].geometry.location.lat,
        //       lng: geocoding.data.results[0].geometry.location.lng,
        //     },
        //     title: response.data.predictions[i].structured_formatting.main_text,
        //     address:
        //       response.data.predictions[i].structured_formatting.secondary_text ??
        //       '',
        //   });
        // }
        return results;
    }
    async reverseGeocode(input) {
        const config = await this.configurationService.getConfiguration();
        const response = await this.googleClient.reverseGeocode({
            params: {
                latlng: {
                    lat: input.lat,
                    lng: input.lng,
                },
                language: input.language,
                key: config.backendMapsAPIKey,
            },
        });
        return {
            point: {
                lat: input.lat,
                lng: input.lng,
            },
            address: response.data.results[0].formatted_address,
        };
    }
};
exports.GoogleGeoService = GoogleGeoService;
exports.GoogleGeoService = GoogleGeoService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [shared_configuration_service_1.SharedConfigurationService])
], GoogleGeoService);


/***/ }),
/* 120 */
/***/ ((module) => {

module.exports = require("@googlemaps/google-maps-services-js");

/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedConfigurationService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const fs = tslib_1.__importStar(__webpack_require__(122));
let SharedConfigurationService = class SharedConfigurationService {
    constructor() { }
    async getConfiguration() {
        const configAddress = `${process.cwd()}/config/config.${process.env.NODE_ENV ?? 'production'}.json`;
        if (fs.existsSync(configAddress)) {
            const file = await fs.promises.readFile(configAddress, {
                encoding: 'utf-8',
            });
            const config = JSON.parse(file);
            const firebaseKeyFileAddress = `${process.cwd()}/config/${config.firebaseProjectPrivateKey}`;
            if (config.firebaseProjectPrivateKey != null &&
                fs.existsSync(firebaseKeyFileAddress)) {
                config.purchaseCode = 'RESTRICTED';
                config.firebaseProjectPrivateKey = 'RESTRICTED';
                return config;
            }
            return config;
        }
        else {
            return {};
        }
    }
};
exports.SharedConfigurationService = SharedConfigurationService;
exports.SharedConfigurationService = SharedConfigurationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], SharedConfigurationService);


/***/ }),
/* 122 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NominitamGeoService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const axios_1 = __webpack_require__(6);
const rxjs_1 = __webpack_require__(124);
let NominitamGeoService = class NominitamGeoService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getPlaces(input) {
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: input.keyword,
                format: 'json',
                addressdetails: '1',
                viewbox: input.location == null
                    ? null
                    : `${input.location.lng - 1},${input.location.lat - 1},${input.location.lng + 1},${input.location.lat + 1}`,
            },
        }));
        const mapped = result.data.map((prediction) => {
            const placeDTO = {
                point: {
                    lat: prediction.lat,
                    lng: prediction.lon,
                },
                title: prediction.name,
                address: prediction.display_name,
            };
            return placeDTO;
        });
        return mapped;
    }
    async reverseGeocode(input) {
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat: input.lat,
                lon: input.lng,
                format: 'json',
            },
        }));
        return {
            point: {
                lat: input.lat,
                lng: input.lng,
            },
            title: result.data.name,
            address: result.data.display_name,
        };
    }
};
exports.NominitamGeoService = NominitamGeoService;
exports.NominitamGeoService = NominitamGeoService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService])
], NominitamGeoService);


/***/ }),
/* 124 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 125 */
/***/ ((module) => {

module.exports = require("@songkeys/nestjs-redis");

/***/ }),
/* 126 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 127 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountingModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const request_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/request.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/provider-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_wallet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/provider-wallet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const accounting_resolver_1 = __webpack_require__(130);
const accounting_service_1 = __webpack_require__(136);
const provider_transaction_dto_1 = __webpack_require__(143);
const provider_wallet_dto_1 = __webpack_require__(181);
const jwt_auth_guard_1 = __webpack_require__(133);
const driver_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const rider_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/rider-entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_transaction_input_1 = __webpack_require__(182);
let AccountingModule = class AccountingModule {
};
exports.AccountingModule = AccountingModule;
exports.AccountingModule = AccountingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                provider_transaction_entity_1.ProviderTransactionEntity,
                request_entity_1.RequestEntity,
                driver_entity_1.DriverEntity,
                rider_entity_1.RiderEntity,
            ]),
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        provider_transaction_entity_1.ProviderTransactionEntity,
                        provider_wallet_entity_1.ProviderWalletEntity,
                    ]),
                ],
                resolvers: [
                    {
                        EntityClass: provider_transaction_entity_1.ProviderTransactionEntity,
                        DTOClass: provider_transaction_dto_1.ProviderTransactionDTO,
                        CreateDTOClass: provider_transaction_input_1.ProviderTransactionInput,
                        create: { many: { disabled: true } },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: provider_wallet_entity_1.ProviderWalletEntity,
                        DTOClass: provider_wallet_dto_1.ProviderWalletDTO,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
        providers: [accounting_service_1.AccountingService, accounting_resolver_1.AccountingResolver],
    })
], AccountingModule);


/***/ }),
/* 129 */
/***/ ((module) => {

module.exports = require("@ptc-org/nestjs-query-typeorm");

/***/ }),
/* 130 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountingResolver = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const promises_1 = __webpack_require__(131);
const json_2_csv_1 = __webpack_require__(132);
const path_1 = __webpack_require__(127);
const typeorm_1 = __webpack_require__(11);
const jwt_auth_guard_1 = __webpack_require__(133);
const accounting_service_1 = __webpack_require__(136);
const chart_timeframe_enum_1 = __webpack_require__(137);
const export_dto_1 = __webpack_require__(138);
const income_result_item_dto_1 = __webpack_require__(140);
const registration_result_item_dto_1 = __webpack_require__(141);
const request_result_item_dto_1 = __webpack_require__(142);
let AccountingResolver = class AccountingResolver {
    constructor(service, dataSource) {
        this.service = service;
        this.dataSource = dataSource;
    }
    async incomeChart(input) {
        const items = await this.service.incomeChart(input);
        return items;
    }
    async requestChart(input) {
        const items = await this.service.requestsChart(input);
        return items;
    }
    async driverRegistrations(input) {
        const items = await this.service.driverRegistrations(input);
        return items;
    }
    async riderRegistrations(input) {
        const items = await this.service.riderRegistrations(input);
        return items;
    }
    async export(input) {
        const options = {};
        if (input.filters) {
            for (const f of input.filters) {
                if (typeof f.value != 'string')
                    continue;
                if (f.value.includes('^')) {
                    const a = f.value.split('^');
                    f.value = (0, typeorm_1.Between)(a[0], a[1]);
                }
                else if (f.value.startsWith('%') && f.value.endsWith('%')) {
                    f.value = (0, typeorm_1.Like)(f.value);
                }
                else if (f.value.includes('|')) {
                    const s = f.value.split('|');
                    f.value = (0, typeorm_1.In)(s);
                }
            }
            options.where = input.filters.map((filter) => {
                let obj = {};
                obj[filter.field] = filter.value;
            });
        }
        if (input.sort) {
            const _sort = {};
            _sort[input.sort.property] = input.sort.direction;
            options.order = _sort;
        }
        if (input.relations != null) {
            options.relations = input.relations;
        }
        const result = (await this.dataSource
            .getRepository(`${input.table}Entity`)
            .find(options));
        if (input.table == 'DriverWallet' && process.env.DEMO_MODE != null) {
            result.forEach((x) => {
                const length = x.driver.mobileNumber.length;
                x.driver.mobileNumber = `${x.driver.mobileNumber
                    .toString()
                    .substring(0, length - 3)}xxxx`;
                x.driver.email = 'Confidential';
            });
        }
        if (input.table == 'RiderWallet' && process.env.DEMO_MODE != null) {
            result.forEach((x) => {
                const length = x.rider.mobileNumber.length;
                x.rider.mobileNumber = `${x.rider.mobileNumber
                    .toString()
                    .substring(0, length - 3)}xxxx`;
                x.rider.email = 'Confidential';
            });
        }
        if (input.type == 'csv') {
            const str = await (0, json_2_csv_1.json2csv)(result);
            const fileName = `${new Date().getTime().toString()}.csv`;
            await (0, promises_1.writeFile)((0, path_1.join)(process.cwd(), 'uploads', `${new Date().getTime().toString()}.csv`), str);
            return {
                url: `uploads/${fileName}`,
            };
        }
    }
};
exports.AccountingResolver = AccountingResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [income_result_item_dto_1.IncomeResultItem]),
    tslib_1.__param(0, (0, graphql_1.Args)('timeframe', { type: () => chart_timeframe_enum_1.ChartTimeframe })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingResolver.prototype, "incomeChart", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [request_result_item_dto_1.RequestResultItem]),
    tslib_1.__param(0, (0, graphql_1.Args)('timeframe', { type: () => chart_timeframe_enum_1.ChartTimeframe })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingResolver.prototype, "requestChart", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [registration_result_item_dto_1.RegistrationResultItemDto]),
    tslib_1.__param(0, (0, graphql_1.Args)('timeframe', { type: () => chart_timeframe_enum_1.ChartTimeframe })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingResolver.prototype, "driverRegistrations", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [registration_result_item_dto_1.RegistrationResultItemDto]),
    tslib_1.__param(0, (0, graphql_1.Args)('timeframe', { type: () => chart_timeframe_enum_1.ChartTimeframe })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingResolver.prototype, "riderRegistrations", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => export_dto_1.ExportResultDTO),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => export_dto_1.ExportArgsDTO })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [export_dto_1.ExportArgsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountingResolver.prototype, "export", null);
exports.AccountingResolver = AccountingResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    tslib_1.__metadata("design:paramtypes", [accounting_service_1.AccountingService,
        typeorm_1.DataSource])
], AccountingResolver);


/***/ }),
/* 131 */
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),
/* 132 */
/***/ ((module) => {

module.exports = require("json-2-csv");

/***/ }),
/* 133 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const apollo_1 = __webpack_require__(5);
const passport_1 = __webpack_require__(134);
const execution_context_host_1 = __webpack_require__(135);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        return super.canActivate(new execution_context_host_1.ExecutionContextHost([req]));
    }
    handleRequest(err, user) {
        if (err || !user) {
            throw err || new apollo_1.AuthenticationError('GqlAuthGuard');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 134 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 135 */
/***/ ((module) => {

module.exports = require("@nestjs/core/helpers/execution-context-host");

/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountingService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const driver_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/provider-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const rider_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/rider-entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const chart_timeframe_enum_1 = __webpack_require__(137);
let AccountingService = class AccountingService {
    constructor(providerTransactionRepository, riderRepository, driverRepository) {
        this.providerTransactionRepository = providerTransactionRepository;
        this.riderRepository = riderRepository;
        this.driverRepository = driverRepository;
    }
    incomeChart(timeframe) {
        const vars = this.getQueryVars(timeframe, 'transactionTime');
        return this.providerTransactionRepository.query(`SELECT currency, SUM(amount) as sum, UNIX_TIMESTAMP(ANY_VALUE(transactionTime)) * 1000 AS time from admin_transaction WHERE ${vars.query} GROUP BY currency, ${vars.groupBy}`);
    }
    requestsChart(timeframe) {
        const vars = this.getQueryVars(timeframe, 'requestTimestamp');
        return this.providerTransactionRepository.query(`SELECT COUNT(status) as count, status, UNIX_TIMESTAMP(ANY_VALUE(requestTimestamp)) * 1000 AS time from \`request\` WHERE ${vars.query} GROUP BY ${vars.groupBy}, status`);
    }
    driverRegistrations(timeframe) {
        const vars = this.getQueryVars(timeframe, 'registrationTimestamp');
        return this.driverRepository.query(`SELECT COUNT(id) as count, UNIX_TIMESTAMP(ANY_VALUE(registrationTimestamp)) * 1000 AS time from driver WHERE ${vars.query} GROUP BY ${vars.groupBy}`);
    }
    riderRegistrations(timeframe) {
        const vars = this.getQueryVars(timeframe, 'registrationTimestamp');
        return this.riderRepository.query(`SELECT COUNT(id) as count, UNIX_TIMESTAMP(ANY_VALUE(registrationTimestamp)) * 1000 AS time from rider WHERE ${vars.query} GROUP BY ${vars.groupBy}`);
    }
    getQueryVars(query, timeField) {
        switch (query) {
            case chart_timeframe_enum_1.ChartTimeframe.Daily:
                return {
                    groupBy: `DATE(${timeField}),TIME(${timeField})`,
                    query: `DATE(${timeField}) = CURDATE()`,
                };
            case chart_timeframe_enum_1.ChartTimeframe.Monthly:
                return {
                    groupBy: `DAYOFYEAR(${timeField}),YEAR(${timeField})`,
                    query: `${timeField} > CURDATE() - INTERVAL 2 MONTH`,
                };
            case chart_timeframe_enum_1.ChartTimeframe.Weekly:
                return {
                    groupBy: `WEEKOFYEAR(${timeField}),YEAR(${timeField})`,
                    query: `${timeField} > CURDATE() - INTERVAL 6 MONTH`,
                };
            case chart_timeframe_enum_1.ChartTimeframe.Yearly:
                return {
                    groupBy: `MONTH(${timeField}),YEAR(${timeField})`,
                    query: `${timeField} > CURDATE() - INTERVAL 12 MONTH`,
                };
        }
    }
};
exports.AccountingService = AccountingService;
exports.AccountingService = AccountingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(provider_transaction_entity_1.ProviderTransactionEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(rider_entity_1.RiderEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(driver_entity_1.DriverEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AccountingService);


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChartTimeframe = void 0;
const graphql_1 = __webpack_require__(7);
var ChartTimeframe;
(function (ChartTimeframe) {
    ChartTimeframe["Daily"] = "Daily";
    ChartTimeframe["Weekly"] = "Weekly";
    ChartTimeframe["Monthly"] = "Monthly";
    ChartTimeframe["Yearly"] = "Yearly";
})(ChartTimeframe || (exports.ChartTimeframe = ChartTimeframe = {}));
(0, graphql_1.registerEnumType)(ChartTimeframe, { name: 'ChartTimeframe' });


/***/ }),
/* 138 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExportSortArg = exports.ExportFilterArg = exports.ExportArgsDTO = exports.ExportResultDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(138);
const eager_import_1 = __webpack_require__(139);
const graphql_1 = __webpack_require__(7);
let ExportResultDTO = class ExportResultDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { url: { type: () => String } };
    }
};
exports.ExportResultDTO = ExportResultDTO;
exports.ExportResultDTO = ExportResultDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ExportResult')
], ExportResultDTO);
var ExportTable;
(function (ExportTable) {
    ExportTable["ProviderWallet"] = "ProviderWallet";
    ExportTable["DriverWallet"] = "DriverWallet";
    ExportTable["RiderWallet"] = "RiderWallet";
    ExportTable["FleetWallet"] = "FleetWallet";
})(ExportTable || (ExportTable = {}));
(0, graphql_1.registerEnumType)(ExportTable, { name: 'ExportTable' });
var ExportType;
(function (ExportType) {
    ExportType["CSV"] = "csv";
})(ExportType || (ExportType = {}));
(0, graphql_1.registerEnumType)(ExportType, { name: 'ExportType' });
let ExportArgsDTO = class ExportArgsDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { table: { type: () => ExportTable }, filters: { nullable: true, type: () => [(__webpack_require__(138).ExportFilterArg)] }, sort: { nullable: true, type: () => (__webpack_require__(138).ExportSortArg) }, relations: { nullable: true, type: () => [String] } };
    }
};
exports.ExportArgsDTO = ExportArgsDTO;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => ExportType, {}),
    tslib_1.__metadata("design:type", String)
], ExportArgsDTO.prototype, "type", void 0);
exports.ExportArgsDTO = ExportArgsDTO = tslib_1.__decorate([
    (0, graphql_1.InputType)('ExportArgs')
], ExportArgsDTO);
let ExportFilterArg = class ExportFilterArg {
    static _GRAPHQL_METADATA_FACTORY() {
        return { field: { type: () => String }, value: { type: () => String } };
    }
};
exports.ExportFilterArg = ExportFilterArg;
exports.ExportFilterArg = ExportFilterArg = tslib_1.__decorate([
    (0, graphql_1.InputType)('ExportFilterArg')
], ExportFilterArg);
let ExportSortArg = class ExportSortArg {
    static _GRAPHQL_METADATA_FACTORY() {
        return { property: { type: () => String }, direction: { type: () => (__webpack_require__(139).SortDirection) } };
    }
};
exports.ExportSortArg = ExportSortArg;
exports.ExportSortArg = ExportSortArg = tslib_1.__decorate([
    (0, graphql_1.InputType)('ExportSortArg')
], ExportSortArg);


/***/ }),
/* 139 */
/***/ ((module) => {

module.exports = require("@ptc-org/nestjs-query-core/src/interfaces/sort-field.interface");

/***/ }),
/* 140 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomeResultItem = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let IncomeResultItem = class IncomeResultItem {
    static _GRAPHQL_METADATA_FACTORY() {
        return { time: { type: () => String }, sum: { type: () => Number }, currency: { type: () => String } };
    }
};
exports.IncomeResultItem = IncomeResultItem;
exports.IncomeResultItem = IncomeResultItem = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], IncomeResultItem);


/***/ }),
/* 141 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegistrationResultItemDto = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let RegistrationResultItemDto = class RegistrationResultItemDto {
    static _GRAPHQL_METADATA_FACTORY() {
        return { time: { type: () => String } };
    }
};
exports.RegistrationResultItemDto = RegistrationResultItemDto;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], RegistrationResultItemDto.prototype, "count", void 0);
exports.RegistrationResultItemDto = RegistrationResultItemDto = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('RegistrationResultItem')
], RegistrationResultItemDto);


/***/ }),
/* 142 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestResultItem = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let RequestResultItem = class RequestResultItem {
    static _GRAPHQL_METADATA_FACTORY() {
        return { time: { type: () => String }, count: { type: () => Number }, status: { type: () => Object } };
    }
};
exports.RequestResultItem = RequestResultItem;
exports.RequestResultItem = RequestResultItem = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], RequestResultItem);


/***/ }),
/* 143 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderTransactionDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/accounting/dto/provider-transaction.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104); // Додано Relation
const graphql_1 = __webpack_require__(7); // Додано Field, Float
// TODO: Перевірити/розширити ці Enum-и для вантажних перевезень
const provider_deduct_transaction_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/provider-deduct-transaction-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_recharge_transaction_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/provider-recharge-transaction-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_dto_1 = __webpack_require__(144); // Для зв'язку з оператором
const order_dto_1 = __webpack_require__(147); // Для зв'язку з замовленням
let ProviderTransactionDTO = class ProviderTransactionDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, description: { nullable: true, type: () => String }, operatorId: { nullable: true, type: () => Number }, requestId: { nullable: true, type: () => Number } };
    }
};
exports.ProviderTransactionDTO = ProviderTransactionDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Date, {}) // Додано Field
    ,
    tslib_1.__metadata("design:type", Date)
], ProviderTransactionDTO.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => transaction_action_enum_1.TransactionAction, {}),
    tslib_1.__metadata("design:type", typeof (_a = typeof transaction_action_enum_1.TransactionAction !== "undefined" && transaction_action_enum_1.TransactionAction) === "function" ? _a : Object)
], ProviderTransactionDTO.prototype, "action", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", typeof (_b = typeof provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType !== "undefined" && provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType) === "function" ? _b : Object)
], ProviderTransactionDTO.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", typeof (_c = typeof provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType !== "undefined" && provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType) === "function" ? _c : Object)
], ProviderTransactionDTO.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}) // Додано Float
    ,
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionDTO.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionDTO.prototype, "requestId", void 0);
exports.ProviderTransactionDTO = ProviderTransactionDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ProviderTransaction'),
    (0, nestjs_query_graphql_1.Relation)('operator', () => operator_dto_1.OperatorDTO, { nullable: true, description: 'Оператор, що створив транзакцію (якщо створено вручну)' }),
    (0, nestjs_query_graphql_1.Relation)('order', () => order_dto_1.OrderDTO, { nullable: true, relationName: 'request', description: 'Замовлення, до якого відноситься транзакція' })
], ProviderTransactionDTO);


/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const operator_role_dto_1 = __webpack_require__(145);
const operator_authorizer_1 = __webpack_require__(146);
let OperatorDTO = class OperatorDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, firstName: { nullable: true, type: () => String }, lastName: { nullable: true, type: () => String }, userName: { type: () => String }, mobileNumber: { nullable: true, type: () => String }, email: { nullable: true, type: () => String } };
    }
};
exports.OperatorDTO = OperatorDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], OperatorDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OperatorDTO.prototype, "roleId", void 0);
exports.OperatorDTO = OperatorDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Operator'),
    (0, nestjs_query_graphql_1.Relation)('role', () => operator_role_dto_1.OperatorRoleDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.Authorize)(operator_authorizer_1.OperatorAuthorizer)
], OperatorDTO);


/***/ }),
/* 145 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorRoleDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const operator_authorizer_1 = __webpack_require__(146);
let OperatorRoleDTO = class OperatorRoleDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, title: { type: () => String }, permissions: { type: () => [Object] } };
    }
};
exports.OperatorRoleDTO = OperatorRoleDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], OperatorRoleDTO.prototype, "id", void 0);
exports.OperatorRoleDTO = OperatorRoleDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('OperatorRole'),
    (0, nestjs_query_graphql_1.Authorize)(operator_authorizer_1.OperatorAuthorizer)
], OperatorRoleDTO);


/***/ }),
/* 146 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let OperatorAuthorizer = class OperatorAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: { role: true },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Users_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Users_Edit)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.OperatorAuthorizer = OperatorAuthorizer;
exports.OperatorAuthorizer = OperatorAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], OperatorAuthorizer);


/***/ }),
/* 147 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
// admin-api/src/app/order/dto/order.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Float
const order_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/order-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_transaction_dto_1 = __webpack_require__(143);
const complaint_dto_1 = __webpack_require__(148);
const coupon_dto_1 = __webpack_require__(150);
const driver_transaction_dto_1 = __webpack_require__(158);
const driver_dto_1 = __webpack_require__(165);
const fleet_transaction_dto_1 = __webpack_require__(174);
const rider_transaction_dto_1 = __webpack_require__(175);
const rider_dto_1 = __webpack_require__(176);
const service_dto_1 = __webpack_require__(151);
const order_message_dto_1 = __webpack_require__(179);
const request_activity_dto_1 = __webpack_require__(180);
// Опціонально: Створюємо DTO для зв'язку з обраними опціями, якщо не хочемо використовувати JSON
// @ObjectType('SelectedOrderOption')
// @Relation('option', () => ServiceOptionDTO)
// export class SelectedOrderOptionDTO {
//   @IDField(() => ID)
//   id: number; // ID запису зв'язку
//   @Field(() => Int, { nullable: true })
//   quantity?: number; // Кількість (наприклад, вантажників)
//   optionId: number;
//   orderId: number;
// }
let OrderDTO = class OrderDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, createdOn: { type: () => Date }, startTimestamp: { nullable: true, type: () => Date }, finishTimestamp: { nullable: true, type: () => Date }, status: { type: () => Object }, currency: { type: () => String }, addresses: { type: () => [String] }, points: { type: () => [(__webpack_require__(72).Point)] }, expectedTimestamp: { nullable: true, type: () => Date }, riderId: { type: () => Number }, driverId: { nullable: true, type: () => Number } };
    }
};
exports.OrderDTO = OrderDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(),
    tslib_1.__metadata("design:type", Date)
], OrderDTO.prototype, "createdOn", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => order_status_enum_1.OrderStatus),
    tslib_1.__metadata("design:type", typeof (_a = typeof order_status_enum_1.OrderStatus !== "undefined" && order_status_enum_1.OrderStatus) === "function" ? _a : Object)
], OrderDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { description: 'Розрахункова відстань (метри)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "distanceBest", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { description: 'Розрахунковий час у дорозі (секунди)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "durationBest", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Початкова розрахункова вартість' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "costBest", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Фінальна вартість після купонів/знижок' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "costAfterCoupon", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, description: 'Опис вантажу' }),
    tslib_1.__metadata("design:type", String)
], OrderDTO.prototype, "cargoDescription", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Вага вантажу (кг)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "cargoWeightKg", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Об\'єм вантажу (м³)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "cargoVolumeM3", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Поверх в точці завантаження (для розрахунку підйому)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "pickupFloors", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Поверх в точці розвантаження (для розрахунку підйому)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "dropoffFloors", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Фактичний час роботи в точці завантаження (хвилини)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "pickupWorkTimeMinutes", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Фактичний час роботи в точці розвантаження (хвилини)' }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "dropoffWorkTimeMinutes", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, description: 'Обрані опції та їх параметри (JSON: [{optionId: 1, quantity: 2}])' }),
    tslib_1.__metadata("design:type", String)
], OrderDTO.prototype, "selectedOptionsJson", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "riderId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrderDTO.prototype, "driverId", void 0);
exports.OrderDTO = OrderDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Order'),
    (0, nestjs_query_graphql_1.Relation)('driver', () => driver_dto_1.DriverDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.Relation)('rider', () => rider_dto_1.RiderDTO, { nullable: true }) // Замовник
    ,
    (0, nestjs_query_graphql_1.Relation)('service', () => service_dto_1.ServiceDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.Relation)('coupon', () => coupon_dto_1.CouponDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.UnPagedRelation)('complaints', () => complaint_dto_1.ComplaintDTO),
    (0, nestjs_query_graphql_1.UnPagedRelation)('conversation', () => order_message_dto_1.OrderMessageDTO, {
        relationName: 'conversation',
    }),
    (0, nestjs_query_graphql_1.UnPagedRelation)('riderTransactions', () => rider_transaction_dto_1.RiderTransactionDTO),
    (0, nestjs_query_graphql_1.UnPagedRelation)('driverTransactions', () => driver_transaction_dto_1.DriverTransactionDTO),
    (0, nestjs_query_graphql_1.UnPagedRelation)('fleetTransactions', () => fleet_transaction_dto_1.FleetTransactionDTO),
    (0, nestjs_query_graphql_1.UnPagedRelation)('providerTransactions', () => provider_transaction_dto_1.ProviderTransactionDTO),
    (0, nestjs_query_graphql_1.UnPagedRelation)('activities', () => request_activity_dto_1.RequestActivityDTO)
    // @UnPagedRelation('selectedOptions', () => SelectedOrderOptionDTO) // Якщо використовуємо окреме DTO
], OrderDTO);


/***/ }),
/* 148 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const complaint_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/complaint-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const order_dto_1 = __webpack_require__(147);
const complaint_activity_dto_1 = __webpack_require__(149);
let ComplaintDTO = class ComplaintDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, inscriptionTimestamp: { type: () => Date }, requestedByDriver: { type: () => Boolean }, subject: { type: () => String }, content: { nullable: true, type: () => String }, status: { type: () => Object }, requestId: { type: () => Number } };
    }
};
exports.ComplaintDTO = ComplaintDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ComplaintDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => complaint_status_enum_1.ComplaintStatus),
    tslib_1.__metadata("design:type", typeof (_a = typeof complaint_status_enum_1.ComplaintStatus !== "undefined" && complaint_status_enum_1.ComplaintStatus) === "function" ? _a : Object)
], ComplaintDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ComplaintDTO.prototype, "requestId", void 0);
exports.ComplaintDTO = ComplaintDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Complaint'),
    (0, nestjs_query_graphql_1.UnPagedRelation)('activities', () => complaint_activity_dto_1.ComplaintActivityDTO, {
        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
    }),
    (0, nestjs_query_graphql_1.Relation)('order', () => order_dto_1.OrderDTO, { relationName: 'request' })
], ComplaintDTO);


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintActivityDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const operator_dto_1 = __webpack_require__(144);
let ComplaintActivityDTO = class ComplaintActivityDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, type: { type: () => Object }, comment: { nullable: true, type: () => String }, complaintId: { type: () => Number } };
    }
};
exports.ComplaintActivityDTO = ComplaintActivityDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ComplaintActivityDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ComplaintActivityDTO.prototype, "complaintId", void 0);
exports.ComplaintActivityDTO = ComplaintActivityDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ComplaintActivity'),
    (0, nestjs_query_graphql_1.Relation)('actor', () => operator_dto_1.OperatorDTO),
    (0, nestjs_query_graphql_1.Relation)('assignedTo', () => operator_dto_1.OperatorDTO, { nullable: true })
], ComplaintActivityDTO);


/***/ }),
/* 150 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const service_dto_1 = __webpack_require__(151);
const coupon_authorizer_1 = __webpack_require__(157);
let CouponDTO = class CouponDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, code: { type: () => String }, title: { type: () => String }, description: { type: () => String }, minimumCost: { type: () => Number }, maximumCost: { type: () => Number }, startAt: { type: () => Date }, expireAt: { type: () => Date }, creditGift: { type: () => Number }, isEnabled: { type: () => Boolean }, isFirstTravelOnly: { type: () => Boolean } };
    }
};
exports.CouponDTO = CouponDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], CouponDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponDTO.prototype, "manyUsersCanUse", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponDTO.prototype, "manyTimesUserCanUse", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponDTO.prototype, "discountPercent", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponDTO.prototype, "discountFlat", void 0);
exports.CouponDTO = CouponDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Coupon'),
    (0, nestjs_query_graphql_1.UnPagedRelation)('allowedServices', () => service_dto_1.ServiceDTO),
    (0, nestjs_query_graphql_1.Authorize)(coupon_authorizer_1.CouponAuthorizer)
], CouponDTO);


/***/ }),
/* 151 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/service/dto/service.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Float
const database_1 = __webpack_require__(9);
const database_2 = __webpack_require__(9);
const service_payment_method_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/service-payment-method.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const date_range_multiplier_dto_1 = __webpack_require__(113);
const weekday_multiplier_dto_1 = __webpack_require__(112);
const region_dto_1 = __webpack_require__(152);
const media_dto_1 = __webpack_require__(154);
const service_option_dto_1 = __webpack_require__(155);
const service_authorizer_1 = __webpack_require__(156);
let ServiceDTO = class ServiceDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, description: { nullable: true, type: () => String }, categoryId: { type: () => Number } };
    }
};
exports.ServiceDTO = ServiceDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Максимальна вантажопідйомність (кг)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "maxPayloadKg", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Максимальний об\'єм вантажу (м³)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "maxVolumeM3", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Базова ставка за подачу / початок поїздки' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "baseFare", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Коефіцієнт округлення вартості' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "roundingFactor", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Вартість за кілометр' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "perKilometer", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Вартість за годину (в дорозі)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "perHourDrive", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Вартість за годину (очікування/простій/завантаження)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "perHourWait", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Додаткова вартість за кг (якщо застосовується)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "perKg", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Додаткова вартість за м³ (якщо застосовується)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "perM3", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Вартість за підйом на поверх (без ліфта)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "perFloorNoLiftFee", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Мінімальна вартість поїздки' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "minimumFee", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { description: 'Радіус пошуку водіїв (метри)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "searchRadius", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => service_payment_method_enum_1.ServicePaymentMethod, { description: 'Доступні методи оплати' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof service_payment_method_enum_1.ServicePaymentMethod !== "undefined" && service_payment_method_enum_1.ServicePaymentMethod) === "function" ? _a : Object)
], ServiceDTO.prototype, "paymentMethod", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Повна вартість скасування для клієнта' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "cancellationTotalFee", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Частка водія від вартості скасування (%)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "cancellationDriverShare", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Комісія платформи (%)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "providerSharePercent", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Фіксована комісія платформи' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "providerShareFlat", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Максимальна відстань поїздки (км)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "maximumDestinationDistance", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [database_2.TimeMultiplier], { description: 'Множники тарифу за часом доби' }),
    tslib_1.__metadata("design:type", Array)
], ServiceDTO.prototype, "timeMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [database_1.DistanceMultiplier], { nullable: true, description: 'Множники тарифу за відстанню' }),
    tslib_1.__metadata("design:type", Array)
], ServiceDTO.prototype, "distanceMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [weekday_multiplier_dto_1.WeekdayMultiplier], { nullable: true, description: 'Множники тарифу за днями тижня' }),
    tslib_1.__metadata("design:type", Array)
], ServiceDTO.prototype, "weekdayMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [date_range_multiplier_dto_1.DateRangeMultiplier], { nullable: true, description: 'Множники тарифу за діапазоном дат' }),
    tslib_1.__metadata("design:type", Array)
], ServiceDTO.prototype, "dateRangeMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ServiceDTO.prototype, "mediaId", void 0);
exports.ServiceDTO = ServiceDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Service'),
    (0, nestjs_query_graphql_1.UnPagedRelation)('regions', () => region_dto_1.RegionDTO, {
        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
        update: { enabled: true },
    }),
    (0, nestjs_query_graphql_1.Relation)('media', () => media_dto_1.MediaDTO, { nullable: true }) // Медіа для іконки послуги
    ,
    (0, nestjs_query_graphql_1.UnPagedRelation)('options', () => service_option_dto_1.ServiceOptionDTO, {
        update: { enabled: true }, // Дозволяємо оновлювати зв'язані опції
    }),
    (0, nestjs_query_graphql_1.Authorize)(service_authorizer_1.ServiceAuthorizer) // Застосовуємо авторизатор
], ServiceDTO);


/***/ }),
/* 152 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const region_authorizer_1 = __webpack_require__(153);
let RegionDTO = class RegionDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, currency: { type: () => String }, enabled: { type: () => Boolean }, location: { type: () => [[(__webpack_require__(72).Point)]] } };
    }
};
exports.RegionDTO = RegionDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RegionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String),
    tslib_1.__metadata("design:type", String)
], RegionDTO.prototype, "currency", void 0);
exports.RegionDTO = RegionDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Region'),
    (0, nestjs_query_graphql_1.Authorize)(region_authorizer_1.RegionAuthorizer)
], RegionDTO);


/***/ }),
/* 153 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let RegionAuthorizer = class RegionAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: { role: true },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Regions_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Regions_Edit)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.RegionAuthorizer = RegionAuthorizer;
exports.RegionAuthorizer = RegionAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], RegionAuthorizer);


/***/ }),
/* 154 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let MediaDTO = class MediaDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, address: { type: () => String }, base64: { nullable: true, type: () => String } };
    }
};
exports.MediaDTO = MediaDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], MediaDTO.prototype, "id", void 0);
exports.MediaDTO = MediaDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Media')
], MediaDTO);


/***/ }),
/* 155 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOptionDTO = exports.CargoServiceOptionIcon = exports.CargoServiceOptionType = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/service/dto/service-option.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Float, registerEnumType
const service_authorizer_1 = __webpack_require__(156);
// Оновлені типи опцій для вантажного таксі
var CargoServiceOptionType;
(function (CargoServiceOptionType) {
    CargoServiceOptionType["BOOLEAN"] = "Boolean";
    CargoServiceOptionType["NUMBER"] = "Number";
    // Можна додати інші типи за потребою
})(CargoServiceOptionType || (exports.CargoServiceOptionType = CargoServiceOptionType = {}));
(0, graphql_1.registerEnumType)(CargoServiceOptionType, { name: 'CargoServiceOptionType' });
// Оновлені іконки для вантажних опцій
var CargoServiceOptionIcon;
(function (CargoServiceOptionIcon) {
    CargoServiceOptionIcon["LOADER"] = "Loader";
    CargoServiceOptionIcon["PACKAGING"] = "Packaging";
    CargoServiceOptionIcon["TAIL_LIFT"] = "TailLift";
    CargoServiceOptionIcon["FRIDGE"] = "Fridge";
    CargoServiceOptionIcon["TOOLS"] = "Tools";
    // Додати інші за потребою
})(CargoServiceOptionIcon || (exports.CargoServiceOptionIcon = CargoServiceOptionIcon = {}));
(0, graphql_1.registerEnumType)(CargoServiceOptionIcon, { name: 'CargoServiceOptionIcon' });
let ServiceOptionDTO = class ServiceOptionDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String } };
    }
};
exports.ServiceOptionDTO = ServiceOptionDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ServiceOptionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)() // Додано можливість фільтрувати за назвою
    ,
    tslib_1.__metadata("design:type", String)
], ServiceOptionDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => CargoServiceOptionType, {}) // Використовуємо новий Enum
    ,
    tslib_1.__metadata("design:type", String)
], ServiceOptionDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Додаткова плата за опцію (або за одиницю, якщо тип Number)' }),
    tslib_1.__metadata("design:type", Number)
], ServiceOptionDTO.prototype, "additionalFee", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => CargoServiceOptionIcon, {}) // Використовуємо новий Enum
    ,
    tslib_1.__metadata("design:type", String)
], ServiceOptionDTO.prototype, "icon", void 0);
exports.ServiceOptionDTO = ServiceOptionDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ServiceOption') // Назву можна залишити, або змінити на CargoServiceOption
    ,
    (0, nestjs_query_graphql_1.Authorize)(service_authorizer_1.ServiceAuthorizer)
], ServiceOptionDTO);


/***/ }),
/* 156 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let ServiceAuthorizer = class ServiceAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: {
                role: true,
            },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Services_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Services_Edit)) {
            if (authorizerContext.operationGroup === 'create' ||
                authorizerContext.operationGroup === 'update' ||
                authorizerContext.operationGroup === 'delete') {
                throw new common_1.UnauthorizedException();
            }
        }
        return undefined;
    }
};
exports.ServiceAuthorizer = ServiceAuthorizer;
exports.ServiceAuthorizer = ServiceAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], ServiceAuthorizer);


/***/ }),
/* 157 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let CouponAuthorizer = class CouponAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: { role: true },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Coupons_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Coupons_Edit)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.CouponAuthorizer = CouponAuthorizer;
exports.CouponAuthorizer = CouponAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponAuthorizer);


/***/ }),
/* 158 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverTransactionDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(18);
// admin-api/src/app/driver/dto/driver-transaction.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Float
// TODO: Перевірити/розширити ці Enum-и для вантажних перевезень
const database_1 = __webpack_require__(9);
const operator_dto_1 = __webpack_require__(144);
const payout_account_dto_1 = __webpack_require__(159); // Додано для зв'язку з рахунком виплати
const payout_method_dto_1 = __webpack_require__(160); // Додано для зв'язку з методом виплати
const driver_dto_1 = __webpack_require__(165);
let DriverTransactionDTO = class DriverTransactionDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, createdAt: { type: () => Date }, status: { type: () => (__webpack_require__(18).TransactionStatus) }, amount: { type: () => Number }, currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, driverId: { type: () => Number }, paymentGatewayId: { nullable: true, type: () => Number }, payoutSessionId: { nullable: true, type: () => Number }, payoutAccountId: { nullable: true, type: () => Number }, payoutMethodId: { nullable: true, type: () => Number }, description: { nullable: true, type: () => String } };
    }
};
exports.DriverTransactionDTO = DriverTransactionDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID) // Зроблено ID фільтрованим
    ,
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(),
    tslib_1.__metadata("design:type", Date)
], DriverTransactionDTO.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => database_1.TransactionAction, {}) // Додано декоратор Field
    ,
    tslib_1.__metadata("design:type", String)
], DriverTransactionDTO.prototype, "action", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => database_1.TransactionStatus) // Зроблено статус фільтрованим
    ,
    tslib_1.__metadata("design:type", String)
], DriverTransactionDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => database_1.DriverDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", String)
], DriverTransactionDTO.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => database_1.DriverRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", String)
], DriverTransactionDTO.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.Float) // Додано Float та фільтрацію
    ,
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID) // Зроблено фільтрованим
    ,
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "paymentGatewayId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "payoutSessionId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "payoutAccountId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "payoutMethodId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }) // Додано Field
    ,
    tslib_1.__metadata("design:type", Number)
], DriverTransactionDTO.prototype, "requestId", void 0);
exports.DriverTransactionDTO = DriverTransactionDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('DriverTransaction'),
    (0, nestjs_query_graphql_1.Relation)('operator', () => operator_dto_1.OperatorDTO, { nullable: true, description: 'Оператор, що створив транзакцію (якщо вручну)' }),
    (0, nestjs_query_graphql_1.Relation)('driver', () => driver_dto_1.DriverDTO, { nullable: true }) // Зв'язок з водієм
    ,
    (0, nestjs_query_graphql_1.Relation)('payoutAccount', () => payout_account_dto_1.PayoutAccountDTO, { nullable: true, description: 'Рахунок, на який/з якого йде виплата/списання' }),
    (0, nestjs_query_graphql_1.Relation)('payoutMethod', () => payout_method_dto_1.PayoutMethodDTO, { nullable: true, description: 'Метод виплати/списання' }) // Додано зв'язок з методом
], DriverTransactionDTO);


/***/ }),
/* 159 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutAccountDTO = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104);
const payout_method_dto_1 = __webpack_require__(160);
let PayoutAccountDTO = class PayoutAccountDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, type: { type: () => Object }, last4: { type: () => String }, currency: { type: () => String }, payoutMethodId: { type: () => Number }, isDefault: { type: () => Object }, accountNumber: { nullable: true, type: () => String }, routingNumber: { nullable: true, type: () => String }, accountHolderName: { nullable: true, type: () => String }, bankName: { nullable: true, type: () => String }, branchName: { nullable: true, type: () => String }, accountHolderAddress: { nullable: true, type: () => String }, accountHolderCity: { nullable: true, type: () => String }, accountHolderState: { nullable: true, type: () => String }, accountHolderZip: { nullable: true, type: () => String }, accountHolderCountry: { nullable: true, type: () => String }, accountHolderPhone: { nullable: true, type: () => String }, accountHolderDateOfBirth: { nullable: true, type: () => Date }, isVerified: { type: () => Boolean } };
    }
};
exports.PayoutAccountDTO = PayoutAccountDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], PayoutAccountDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(),
    tslib_1.__metadata("design:type", Boolean)
], PayoutAccountDTO.prototype, "isDefault", void 0);
exports.PayoutAccountDTO = PayoutAccountDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('PayoutAccount'),
    (0, nestjs_query_graphql_1.Relation)('payoutMethod', () => payout_method_dto_1.PayoutMethodDTO)
], PayoutAccountDTO);


/***/ }),
/* 160 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutMethodDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/payout/dto/payout-method.dto.ts
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104);
// TODO: Перевірити/розширити цей Enum для вантажних перевезень (напр., FuelCard, B2BTransfer)
const payout_method_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/payout-method-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const media_dto_1 = __webpack_require__(154);
const driver_transaction_dto_1 = __webpack_require__(158);
const stripe_1 = __webpack_require__(161);
const payout_authorizer_1 = __webpack_require__(162);
const payment_gateway_dto_1 = __webpack_require__(163); // Використовуємо маскування ключів
let PayoutMethodDTO = class PayoutMethodDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, enabled: { type: () => Boolean }, currency: { type: () => String }, name: { type: () => String }, description: { nullable: true, type: () => String }, type: { type: () => Object } };
    }
};
exports.PayoutMethodDTO = PayoutMethodDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], PayoutMethodDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)({ description: 'Чи активний метод виплат' }) // Додано фільтрацію
    ,
    tslib_1.__metadata("design:type", Boolean)
], PayoutMethodDTO.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)({ description: 'Валюта, в якій проводяться виплати' }) // Додано фільтрацію
    ,
    tslib_1.__metadata("design:type", String)
], PayoutMethodDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => payout_method_type_enum_1.PayoutMethodType, { description: 'Тип методу виплат' }) // Додано фільтрацію // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", typeof (_a = typeof payout_method_type_enum_1.PayoutMethodType !== "undefined" && payout_method_type_enum_1.PayoutMethodType) === "function" ? _a : Object)
], PayoutMethodDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, middleware: [payment_gateway_dto_1.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodDTO.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, middleware: [payment_gateway_dto_1.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodDTO.prototype, "privateKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, middleware: [payment_gateway_dto_1.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodDTO.prototype, "saltKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, middleware: [payment_gateway_dto_1.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PayoutMethodDTO.prototype, "merchantId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PayoutMethodDTO.prototype, "mediaId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true,
        description: 'Поточний баланс на рахунку платіжної системи (якщо підтримується)',
        middleware: [
            async (context, next) => {
                // Поточна логіка ТІЛЬКИ для Stripe
                if (context.source.type === payout_method_type_enum_1.PayoutMethodType.Stripe && context.source.privateKey) {
                    try {
                        const stripe = new stripe_1.Stripe(context.source.privateKey, {
                            apiVersion: '2022-11-15', // Перевірити актуальність версії API
                        });
                        const balance = await stripe.balance.retrieve();
                        const availableBalance = balance.available.find((b) => b.currency.toLowerCase() ===
                            context.source.currency.toLowerCase());
                        // Повертаємо суму в основних одиницях (ділимо на 100 для копійок/центів)
                        return availableBalance ? availableBalance.amount / 100 : 0;
                    }
                    catch (error) {
                        console.error("Stripe balance retrieval error:", error.message);
                        return null; // Повертаємо null у разі помилки
                    }
                }
                // Для інших методів повертаємо null або реалізуємо відповідну логіку
                return null;
            },
        ] }),
    tslib_1.__metadata("design:type", Number)
], PayoutMethodDTO.prototype, "balance", void 0);
exports.PayoutMethodDTO = PayoutMethodDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('PayoutMethod'),
    (0, nestjs_query_graphql_1.Relation)('media', () => media_dto_1.MediaDTO, { nullable: true, description: 'Іконка методу виплат' }),
    (0, nestjs_query_graphql_1.FilterableRelation)('driverTransactions', () => driver_transaction_dto_1.DriverTransactionDTO, { description: 'Транзакції, пов\'язані з цим методом виплат' }),
    (0, nestjs_query_graphql_1.Authorize)(payout_authorizer_1.PayoutAuthorizer) // Застосовуємо авторизатор
], PayoutMethodDTO);


/***/ }),
/* 161 */
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),
/* 162 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let PayoutAuthorizer = class PayoutAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: {
                role: true,
            },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Payouts_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Payouts_Edit)) {
            if (authorizerContext.operationGroup === 'create' ||
                authorizerContext.operationGroup === 'update' ||
                authorizerContext.operationGroup === 'delete') {
                throw new common_1.UnauthorizedException();
            }
        }
        return undefined;
    }
};
exports.PayoutAuthorizer = PayoutAuthorizer;
exports.PayoutAuthorizer = PayoutAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], PayoutAuthorizer);


/***/ }),
/* 163 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentGatewayDTO = exports.apiKeyMasker = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const media_dto_1 = __webpack_require__(154);
const gateway_authorizer_1 = __webpack_require__(164);
const apiKeyMasker = async (ctx, next) => {
    let value = await next();
    if (process.env.DEMO_MODE != null && value != null && value.length > 0) {
        value = value
            .toString()
            .split('')
            .map(() => '*')
            .join('');
    }
    return value;
};
exports.apiKeyMasker = apiKeyMasker;
let PaymentGatewayDTO = class PaymentGatewayDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, enabled: { type: () => Boolean }, title: { type: () => String }, type: { type: () => Object }, mediaId: { nullable: true, type: () => Number } };
    }
};
exports.PaymentGatewayDTO = PaymentGatewayDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], PaymentGatewayDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, middleware: [exports.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayDTO.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { middleware: [exports.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayDTO.prototype, "privateKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, middleware: [exports.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayDTO.prototype, "merchantId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, middleware: [exports.apiKeyMasker] }),
    tslib_1.__metadata("design:type", String)
], PaymentGatewayDTO.prototype, "saltKey", void 0);
exports.PaymentGatewayDTO = PaymentGatewayDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('PaymentGateway'),
    (0, nestjs_query_graphql_1.Authorize)(gateway_authorizer_1.GatewayAuthorizer),
    (0, nestjs_query_graphql_1.Relation)('media', () => media_dto_1.MediaDTO, { nullable: true })
], PaymentGatewayDTO);


/***/ }),
/* 164 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatewayAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let GatewayAuthorizer = class GatewayAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: {
                role: true,
            },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Gateways_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Gateways_Edit)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.GatewayAuthorizer = GatewayAuthorizer;
exports.GatewayAuthorizer = GatewayAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], GatewayAuthorizer);


/***/ }),
/* 165 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/driver/dto/driver.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const driver_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/driver-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const feedback_dto_1 = __webpack_require__(166);
const number_masker_middleware_1 = __webpack_require__(169);
const order_dto_1 = __webpack_require__(147);
const service_dto_1 = __webpack_require__(151);
const media_dto_1 = __webpack_require__(154);
const driver_transaction_dto_1 = __webpack_require__(158);
const driver_wallet_dto_1 = __webpack_require__(170);
const payout_account_dto_1 = __webpack_require__(159);
// Імпортуємо оновлені DTO для транспорту
const vehicle_model_dto_1 = __webpack_require__(171);
const vehicle_color_dto_1 = __webpack_require__(173);
let DriverDTO = class DriverDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, fleetId: { nullable: true, type: () => Number }, firstName: { nullable: true, type: () => String }, lastName: { nullable: true, type: () => String }, mobileNumber: { type: () => String }, certificateNumber: { nullable: true, type: () => String }, email: { nullable: true, type: () => String }, status: { type: () => Object }, gender: { nullable: true, type: () => Object }, rating: { nullable: true, type: () => Number }, reviewCount: { type: () => Number }, registrationTimestamp: { type: () => Date }, lastSeenTimestamp: { nullable: true, type: () => Date }, accountNumber: { nullable: true, type: () => String }, bankName: { nullable: true, type: () => String }, bankRoutingNumber: { nullable: true, type: () => String }, bankSwift: { nullable: true, type: () => String }, address: { nullable: true, type: () => String }, softRejectionNote: { nullable: true, type: () => String } };
    }
};
exports.DriverDTO = DriverDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], DriverDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverDTO.prototype, "fleetId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String),
    tslib_1.__metadata("design:type", String)
], DriverDTO.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String, { middleware: [number_masker_middleware_1.numberMasker] }),
    tslib_1.__metadata("design:type", String)
], DriverDTO.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverDTO.prototype, "vehicleModelId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverDTO.prototype, "vehicleColorId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], DriverDTO.prototype, "vehiclePlate", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => driver_status_enum_1.DriverStatus),
    tslib_1.__metadata("design:type", typeof (_a = typeof driver_status_enum_1.DriverStatus !== "undefined" && driver_status_enum_1.DriverStatus) === "function" ? _a : Object)
], DriverDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DriverDTO.prototype, "mediaId", void 0);
exports.DriverDTO = DriverDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Driver'),
    (0, nestjs_query_graphql_1.OffsetConnection)('feedbacks', () => feedback_dto_1.FeedbackDTO, { enableAggregate: true }),
    (0, nestjs_query_graphql_1.UnPagedRelation)('wallet', () => driver_wallet_dto_1.DriverWalletDTO, { relationName: 'wallet' }),
    (0, nestjs_query_graphql_1.UnPagedRelation)('enabledServices', () => service_dto_1.ServiceDTO, {
        update: { enabled: true },
    }),
    (0, nestjs_query_graphql_1.UnPagedRelation)('documents', () => media_dto_1.MediaDTO),
    (0, nestjs_query_graphql_1.OffsetConnection)('transactions', () => driver_transaction_dto_1.DriverTransactionDTO),
    (0, nestjs_query_graphql_1.OffsetConnection)('orders', () => order_dto_1.OrderDTO),
    (0, nestjs_query_graphql_1.Relation)('media', () => media_dto_1.MediaDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.OffsetConnection)('payoutAccounts', () => payout_account_dto_1.PayoutAccountDTO)
    // Додаємо зв'язки з новою моделлю та кольором
    ,
    (0, nestjs_query_graphql_1.Relation)('vehicleModel', () => vehicle_model_dto_1.VehicleModelDTO, { nullable: true, description: "Модель ТЗ водія" }),
    (0, nestjs_query_graphql_1.Relation)('vehicleColor', () => vehicle_color_dto_1.VehicleColorDTO, { nullable: true, description: "Колір ТЗ водія" })
], DriverDTO);


/***/ }),
/* 166 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/feedback/dto/feedback.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const feedback_parameter_dto_1 = __webpack_require__(167); // Ім'я файлу параметру не змінилось
const order_dto_1 = __webpack_require__(147); // Додаємо зв'язок із замовленням
const driver_dto_1 = __webpack_require__(165); // Додаємо зв'язок із водієм
let FeedbackDTO = class FeedbackDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, description: { nullable: true, type: () => String }, driverId: { type: () => Number }, requestId: { type: () => Number } };
    }
};
exports.FeedbackDTO = FeedbackDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FeedbackDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], FeedbackDTO.prototype, "score", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Date, {}) // Додано Field
    ,
    tslib_1.__metadata("design:type", Date)
], FeedbackDTO.prototype, "reviewTimestamp", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FeedbackDTO.prototype, "driverId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FeedbackDTO.prototype, "requestId", void 0);
exports.FeedbackDTO = FeedbackDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Feedback')
    // Зв'язок з параметрами залишається
    ,
    (0, nestjs_query_graphql_1.FilterableUnPagedRelation)('parameters', () => feedback_parameter_dto_1.FeedbackParameterDTO, {
        enableAggregate: true,
    }),
    (0, nestjs_query_graphql_1.Relation)('order', () => order_dto_1.OrderDTO, { relationName: 'request' }) // Зв'язок з конкретним замовленням
    ,
    (0, nestjs_query_graphql_1.Relation)('driver', () => driver_dto_1.DriverDTO) // Зв'язок з водієм, якого оцінюють
], FeedbackDTO);


/***/ }),
/* 167 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackParameterDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/feedback/dto/feedback-parameter.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Field
const feedback_parameter_authorizer_1 = __webpack_require__(168);
let FeedbackParameterDTO = class FeedbackParameterDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, title: { type: () => String }, isGood: { type: () => Boolean } };
    }
};
exports.FeedbackParameterDTO = FeedbackParameterDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FeedbackParameterDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)()
    // Приклади назв для вантажного таксі:
    // "Стан вантажу при доставці", "Швидкість завантаження/розвантаження",
    // "Дотримання термінів", "Професіоналізм водія (поводження з вантажем)",
    // "Комунікація з водієм", "Відповідність авто замовленню"
    ,
    tslib_1.__metadata("design:type", String)
], FeedbackParameterDTO.prototype, "title", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)()
    // Чи є параметр позитивним (true) чи негативним (false)
    // Наприклад: "Стан вантажу..." (isGood=true), "Пошкодження вантажу" (isGood=false)
    ,
    tslib_1.__metadata("design:type", Boolean)
], FeedbackParameterDTO.prototype, "isGood", void 0);
exports.FeedbackParameterDTO = FeedbackParameterDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('FeedbackParameter'),
    (0, nestjs_query_graphql_1.Authorize)(feedback_parameter_authorizer_1.FeedbackParameterAuthorizer) // Застосовуємо авторизатор
], FeedbackParameterDTO);


/***/ }),
/* 168 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackParameterAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let FeedbackParameterAuthorizer = class FeedbackParameterAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        if (authorizerContext.readonly) {
            // Дозвіл на читання параметрів зазвичай не потрібен або відкритий
            return undefined;
        }
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: { role: true },
        });
        // Перевіряємо право на редагування параметрів відгуків
        const editPermission = operator_permission_enum_1.OperatorPermission.ReviewParameter_Edit; // TODO: Перевірити/перейменувати право
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(editPermission)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.FeedbackParameterAuthorizer = FeedbackParameterAuthorizer;
exports.FeedbackParameterAuthorizer = FeedbackParameterAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], FeedbackParameterAuthorizer);


/***/ }),
/* 169 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.numberMasker = void 0;
const numberMasker = async (ctx, next) => {
    let value = await next();
    const length = value.toString().length;
    if (process.env.DEMO_MODE != null && value != null && length > 4) {
        value = `${value.toString().substring(0, length - 3)}xxxx`;
    }
    return value;
};
exports.numberMasker = numberMasker;


/***/ }),
/* 170 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverWalletDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const driver_dto_1 = __webpack_require__(165);
let DriverWalletDTO = class DriverWalletDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, balance: { type: () => Number }, currency: { type: () => String }, driverId: { nullable: true, type: () => Number } };
    }
};
exports.DriverWalletDTO = DriverWalletDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], DriverWalletDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.Float),
    tslib_1.__metadata("design:type", Number)
], DriverWalletDTO.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String),
    tslib_1.__metadata("design:type", String)
], DriverWalletDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], DriverWalletDTO.prototype, "driverId", void 0);
exports.DriverWalletDTO = DriverWalletDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('DriverWallet'),
    (0, nestjs_query_graphql_1.Relation)('driver', () => driver_dto_1.DriverDTO, { nullable: true })
], DriverWalletDTO);


/***/ }),
/* 171 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleModelDTO = exports.VehicleType = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/vehicle/dto/vehicle-model.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const vehicle_authorizer_1 = __webpack_require__(172);
// Додано новий Enum для типів транспорту
var VehicleType;
(function (VehicleType) {
    VehicleType["CAR"] = "Car";
    VehicleType["VAN"] = "Van";
    VehicleType["TRUCK_SMALL"] = "TruckSmall";
    VehicleType["TRUCK_MEDIUM"] = "TruckMedium";
    VehicleType["TRUCK_LARGE"] = "TruckLarge";
    VehicleType["REFRIGERATOR"] = "Refrigerator";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
(0, graphql_1.registerEnumType)(VehicleType, { name: 'VehicleType' });
let VehicleModelDTO = class VehicleModelDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String } };
    }
};
exports.VehicleModelDTO = VehicleModelDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], VehicleModelDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => VehicleType, { description: 'Тип транспортного засобу' }),
    tslib_1.__metadata("design:type", String)
], VehicleModelDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Number, { nullable: true, description: 'Максимальна вантажопідйомність (кг)' }),
    tslib_1.__metadata("design:type", Number)
], VehicleModelDTO.prototype, "payloadCapacityKg", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Number, { nullable: true, description: 'Максимальний об\'єм кузова (м³)' }),
    tslib_1.__metadata("design:type", Number)
], VehicleModelDTO.prototype, "volumeCapacityM3", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true, description: 'Наявність гідроборта' }),
    tslib_1.__metadata("design:type", Boolean)
], VehicleModelDTO.prototype, "hasTailLift", void 0);
exports.VehicleModelDTO = VehicleModelDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('VehicleModel'),
    (0, nestjs_query_graphql_1.Authorize)(vehicle_authorizer_1.VehicleAuthorizer)
], VehicleModelDTO);


/***/ }),
/* 172 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
// Потенційно перейменувати права доступу або додати нові для вантажівок
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let VehicleAuthorizer = class VehicleAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: { role: true },
        });
        // Перевіряємо права доступу (можливо, треба буде створити нові, наприклад, Vehicles_View/Edit)
        const viewPermission = operator_permission_enum_1.OperatorPermission.Cars_View; // TODO: Замінити на Vehicles_View, якщо буде створено
        const editPermission = operator_permission_enum_1.OperatorPermission.Cars_Edit; // TODO: Замінити на Vehicles_Edit, якщо буде створено
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(viewPermission)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(editPermission)) {
            if (authorizerContext.operationGroup === 'create' ||
                authorizerContext.operationGroup === 'update' ||
                authorizerContext.operationGroup === 'delete') {
                throw new common_1.UnauthorizedException();
            }
        }
        return undefined;
    }
};
exports.VehicleAuthorizer = VehicleAuthorizer;
exports.VehicleAuthorizer = VehicleAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], VehicleAuthorizer);


/***/ }),
/* 173 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleColorDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/vehicle/dto/vehicle-color.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const vehicle_authorizer_1 = __webpack_require__(172);
let VehicleColorDTO = class VehicleColorDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String } };
    }
};
exports.VehicleColorDTO = VehicleColorDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], VehicleColorDTO.prototype, "id", void 0);
exports.VehicleColorDTO = VehicleColorDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('VehicleColor'),
    (0, nestjs_query_graphql_1.Authorize)(vehicle_authorizer_1.VehicleAuthorizer)
], VehicleColorDTO);


/***/ }),
/* 174 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetTransactionDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/fleet/dto/fleet-transaction.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Field, Float
const operator_dto_1 = __webpack_require__(144);
let FleetTransactionDTO = class FleetTransactionDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, action: { type: () => Object }, deductType: { nullable: true, type: () => Object }, rechargeType: { nullable: true, type: () => Object }, currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, description: { nullable: true, type: () => String }, operatorId: { nullable: true, type: () => Number }, requestId: { nullable: true, type: () => Number }, fleetId: { type: () => Number } };
    }
};
exports.FleetTransactionDTO = FleetTransactionDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Date, {}) // Дата/час транзакції
    ,
    tslib_1.__metadata("design:type", Date)
], FleetTransactionDTO.prototype, "transactionTimestamp", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionDTO.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionDTO.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionDTO.prototype, "fleetId", void 0);
exports.FleetTransactionDTO = FleetTransactionDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('FleetTransaction'),
    (0, nestjs_query_graphql_1.Relation)('operator', () => operator_dto_1.OperatorDTO, { nullable: true })
], FleetTransactionDTO);


/***/ }),
/* 175 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderTransactionDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const operator_dto_1 = __webpack_require__(144);
const payment_gateway_dto_1 = __webpack_require__(163);
const rider_dto_1 = __webpack_require__(176);
let RiderTransactionDTO = class RiderTransactionDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, action: { type: () => Object }, createdAt: { type: () => Date }, deductType: { nullable: true, type: () => Object }, rechargeType: { nullable: true, type: () => Object }, status: { type: () => Object }, amount: { type: () => Number }, currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, description: { nullable: true, type: () => String }, riderId: { type: () => Number } };
    }
};
exports.RiderTransactionDTO = RiderTransactionDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(),
    tslib_1.__metadata("design:type", Date)
], RiderTransactionDTO.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.Float),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionDTO.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String),
    tslib_1.__metadata("design:type", String)
], RiderTransactionDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionDTO.prototype, "riderId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionDTO.prototype, "paymentGatewayId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionDTO.prototype, "operatorId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionDTO.prototype, "requestId", void 0);
exports.RiderTransactionDTO = RiderTransactionDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('RiderTransaction'),
    (0, nestjs_query_graphql_1.Relation)('operator', () => operator_dto_1.OperatorDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.Relation)('paymentGateway', () => payment_gateway_dto_1.PaymentGatewayDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.Relation)('rider', () => rider_dto_1.RiderDTO)
], RiderTransactionDTO);


/***/ }),
/* 176 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const gender_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/gender.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const number_masker_middleware_1 = __webpack_require__(169);
const order_dto_1 = __webpack_require__(147);
const media_dto_1 = __webpack_require__(154);
const rider_address_dto_1 = __webpack_require__(177);
const rider_transaction_dto_1 = __webpack_require__(175);
const rider_wallet_dto_1 = __webpack_require__(178);
let RiderDTO = class RiderDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, status: { type: () => Object }, firstName: { nullable: true, type: () => String }, lastName: { nullable: true, type: () => String }, mobileNumber: { type: () => String }, registrationTimestamp: { type: () => Date }, email: { nullable: true, type: () => String }, isResident: { nullable: true, type: () => Boolean }, idNumber: { nullable: true, type: () => String } };
    }
};
exports.RiderDTO = RiderDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RiderDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(),
    tslib_1.__metadata("design:type", String)
], RiderDTO.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(),
    tslib_1.__metadata("design:type", String)
], RiderDTO.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String, { middleware: [number_masker_middleware_1.numberMasker] }),
    tslib_1.__metadata("design:type", String)
], RiderDTO.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => gender_enum_1.Gender, { nullable: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof gender_enum_1.Gender !== "undefined" && gender_enum_1.Gender) === "function" ? _a : Object)
], RiderDTO.prototype, "gender", void 0);
exports.RiderDTO = RiderDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Rider'),
    (0, nestjs_query_graphql_1.OffsetConnection)('addresses', () => rider_address_dto_1.RiderAddressDTO),
    (0, nestjs_query_graphql_1.OffsetConnection)('wallet', () => rider_wallet_dto_1.RiderWalletDTO),
    (0, nestjs_query_graphql_1.OffsetConnection)('transactions', () => rider_transaction_dto_1.RiderTransactionDTO),
    (0, nestjs_query_graphql_1.OffsetConnection)('orders', () => order_dto_1.OrderDTO),
    (0, nestjs_query_graphql_1.Relation)('media', () => media_dto_1.MediaDTO, { nullable: true })
], RiderDTO);


/***/ }),
/* 177 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderAddressDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let RiderAddressDTO = class RiderAddressDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, type: { type: () => Object }, title: { type: () => String }, details: { nullable: true, type: () => String }, location: { type: () => (__webpack_require__(72).Point) }, riderId: { type: () => Number } };
    }
};
exports.RiderAddressDTO = RiderAddressDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RiderAddressDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RiderAddressDTO.prototype, "riderId", void 0);
exports.RiderAddressDTO = RiderAddressDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('RiderAddress')
], RiderAddressDTO);


/***/ }),
/* 178 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderWalletDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const rider_dto_1 = __webpack_require__(176);
let RiderWalletDTO = class RiderWalletDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, balance: { type: () => Number }, currency: { type: () => String }, riderId: { nullable: true, type: () => Number } };
    }
};
exports.RiderWalletDTO = RiderWalletDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RiderWalletDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.Float),
    tslib_1.__metadata("design:type", Number)
], RiderWalletDTO.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RiderWalletDTO.prototype, "riderId", void 0);
exports.RiderWalletDTO = RiderWalletDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('RiderWallet'),
    (0, nestjs_query_graphql_1.Relation)('rider', () => rider_dto_1.RiderDTO, { nullable: true })
], RiderWalletDTO);


/***/ }),
/* 179 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderMessageDTO = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104);
let OrderMessageDTO = class OrderMessageDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, sentAt: { type: () => Date }, sentByDriver: { type: () => Boolean }, status: { type: () => Object }, content: { type: () => String } };
    }
};
exports.OrderMessageDTO = OrderMessageDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], OrderMessageDTO.prototype, "id", void 0);
exports.OrderMessageDTO = OrderMessageDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('OrderMessage')
], OrderMessageDTO);


/***/ }),
/* 180 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestActivityDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let RequestActivityDTO = class RequestActivityDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, createdAt: { type: () => Date }, type: { type: () => Object } };
    }
};
exports.RequestActivityDTO = RequestActivityDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RequestActivityDTO.prototype, "id", void 0);
exports.RequestActivityDTO = RequestActivityDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('RequestActivity')
], RequestActivityDTO);


/***/ }),
/* 181 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderWalletDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let ProviderWalletDTO = class ProviderWalletDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, balance: { type: () => Number }, currency: { type: () => String } };
    }
};
exports.ProviderWalletDTO = ProviderWalletDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ProviderWalletDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.Float),
    tslib_1.__metadata("design:type", Number)
], ProviderWalletDTO.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String),
    tslib_1.__metadata("design:type", String)
], ProviderWalletDTO.prototype, "currency", void 0);
exports.ProviderWalletDTO = ProviderWalletDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ProviderWallet')
], ProviderWalletDTO);


/***/ }),
/* 182 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderTransactionInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/accounting/dto/provider-transaction.input.ts
const graphql_1 = __webpack_require__(7); // Додано Float
// TODO: Перевірити/розширити ці Enum-и
const provider_deduct_transaction_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/provider-deduct-transaction-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_recharge_transaction_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/provider-recharge-transaction-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let ProviderTransactionInput = class ProviderTransactionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, description: { nullable: true, type: () => String } };
    }
};
exports.ProviderTransactionInput = ProviderTransactionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => transaction_action_enum_1.TransactionAction, {}),
    tslib_1.__metadata("design:type", typeof (_a = typeof transaction_action_enum_1.TransactionAction !== "undefined" && transaction_action_enum_1.TransactionAction) === "function" ? _a : Object)
], ProviderTransactionInput.prototype, "action", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", typeof (_b = typeof provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType !== "undefined" && provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType) === "function" ? _b : Object)
], ProviderTransactionInput.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", typeof (_c = typeof provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType !== "undefined" && provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType) === "function" ? _c : Object)
], ProviderTransactionInput.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}) // Додано Float
    ,
    tslib_1.__metadata("design:type", Number)
], ProviderTransactionInput.prototype, "amount", void 0);
exports.ProviderTransactionInput = ProviderTransactionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], ProviderTransactionInput);


/***/ }),
/* 183 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddressModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const rider_address_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/rider-address.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const address_dto_1 = __webpack_require__(184);
let AddressModule = class AddressModule {
};
exports.AddressModule = AddressModule;
exports.AddressModule = AddressModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([rider_address_entity_1.RiderAddressEntity])],
                resolvers: [
                    {
                        EntityClass: rider_address_entity_1.RiderAddressEntity,
                        DTOClass: address_dto_1.AddressDTO,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], AddressModule);


/***/ }),
/* 184 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddressDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let AddressDTO = class AddressDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, title: { type: () => String }, type: { type: () => Object }, details: { nullable: true, type: () => String }, location: { type: () => (__webpack_require__(72).Point) }, riderId: { type: () => Number } };
    }
};
exports.AddressDTO = AddressDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], AddressDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], AddressDTO.prototype, "riderId", void 0);
exports.AddressDTO = AddressDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Address')
], AddressDTO);


/***/ }),
/* 185 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminApiSetupNotFoundController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
let AdminApiSetupNotFoundController = class AdminApiSetupNotFoundController {
    restart(res) {
        res.send('✅ Restarting...');
        process.exit(1);
    }
};
exports.AdminApiSetupNotFoundController = AdminApiSetupNotFoundController;
tslib_1.__decorate([
    (0, common_1.Get)('/restart'),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AdminApiSetupNotFoundController.prototype, "restart", null);
exports.AdminApiSetupNotFoundController = AdminApiSetupNotFoundController = tslib_1.__decorate([
    (0, common_1.Controller)()
], AdminApiSetupNotFoundController);


/***/ }),
/* 186 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const fastify = tslib_1.__importStar(__webpack_require__(187));
const promises_1 = __webpack_require__(131);
const firebase_admin_1 = __webpack_require__(188);
const rest_jwt_auth_guard_1 = __webpack_require__(189);
const upload_service_1 = __webpack_require__(190);
const package_json_1 = __webpack_require__(193);
const app_1 = __webpack_require__(194);
const fs_1 = __webpack_require__(122);
let AppController = class AppController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async defaultPath(res) {
        res.send(`✅ Admin API microservice running.\nVersion: ${package_json_1.version}`);
    }
    async upload(req, res) {
        await this.uploadService.uploadMedia(req, res, 'uploads', new Date().getTime().toString());
    }
    async reconfig(req, res) {
        const configAddress = `${process.cwd()}/config/config.${process.env.NODE_ENV ?? 'production'}.json`;
        await (0, promises_1.rm)(configAddress);
        res.send('✅ Config file deleted. Restarting...');
        process.exit(1);
    }
    async apps(res) {
        const configAddress = `${process.cwd()}/config/config.${process.env.NODE_ENV ?? 'production'}.json`;
        if ((0, fs_1.existsSync)(configAddress)) {
            const file = await (0, promises_1.readFile)(configAddress, { encoding: 'utf-8' });
            const config = JSON.parse(file);
            (0, app_1.initializeApp)({
                credential: firebase_admin_1.credential.cert(`${process.cwd()}/config/${config.firebaseProjectPrivateKey}`),
            });
            const apps = await (0, firebase_admin_1.projectManagement)().listAppMetadata();
            const finalListOfApps = [];
            for (const app of apps) {
                if (app.platform === 'ANDROID') {
                    const config = JSON.parse(await (0, firebase_admin_1.projectManagement)().androidApp(app.appId).getConfig());
                    finalListOfApps.push({
                        packageName: config.client
                            .filter((c) => c.client_info.mobilesdk_app_id == app.appId)
                            .map((c) => c.client_info.android_client_info.package_name)[0],
                    });
                }
            }
            res.send(finalListOfApps);
            return finalListOfApps;
        }
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppController.prototype, "defaultPath", null);
tslib_1.__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(rest_jwt_auth_guard_1.RestJwtAuthGuard),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppController.prototype, "upload", null);
tslib_1.__decorate([
    (0, common_1.Get)('reconfig'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppController.prototype, "reconfig", null);
tslib_1.__decorate([
    (0, common_1.Get)('apps'),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppController.prototype, "apps", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [upload_service_1.UploadService])
], AppController);


/***/ }),
/* 187 */
/***/ ((module) => {

module.exports = require("fastify");

/***/ }),
/* 188 */
/***/ ((module) => {

module.exports = require("firebase-admin");

/***/ }),
/* 189 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RestJwtAuthGuard = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(134);
let RestJwtAuthGuard = class RestJwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('REST API Auth blocked reqeust.');
        }
        return user;
    }
};
exports.RestJwtAuthGuard = RestJwtAuthGuard;
exports.RestJwtAuthGuard = RestJwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], RestJwtAuthGuard);


/***/ }),
/* 190 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const fs = tslib_1.__importStar(__webpack_require__(122));
const util = tslib_1.__importStar(__webpack_require__(191));
const path_1 = __webpack_require__(127);
const typeorm_1 = __webpack_require__(11);
const media_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/media.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(8);
const stream_1 = __webpack_require__(192);
const pump = util.promisify(stream_1.pipeline);
let UploadService = class UploadService {
    constructor(mediaRepository) {
        this.mediaRepository = mediaRepository;
    }
    async uploadMedia(req, res, dir, fileNamePrefix) {
        //Check request is multipart
        if (!req.isMultipart()) {
            res.send(new common_1.BadRequestException());
            return;
        }
        const data = await req.file();
        await fs.promises.mkdir(dir, { recursive: true });
        const _fileName = (0, path_1.join)(dir, fileNamePrefix != null ? `${fileNamePrefix}-${data.filename}` : data.filename);
        await pump(data.file, fs.createWriteStream(_fileName));
        const insert = await this.mediaRepository.insert({ address: _fileName });
        res.code(200).send({ id: insert.raw.insertId, address: _fileName });
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_2.InjectRepository)(media_entity_1.MediaEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository])
], UploadService);


/***/ }),
/* 191 */
/***/ ((module) => {

module.exports = require("util");

/***/ }),
/* 192 */
/***/ ((module) => {

module.exports = require("stream");

/***/ }),
/* 193 */
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"ridy","version":"3.2.3","license":"MIT","scripts":{"ng":"nx","postinstall":"node ./decorate-angular-cli.js","nx":"nx","start":"ts-node src/index.ts","build":"ng build","test":"ng test","lint":"nx workspace-lint && ng lint","e2e":"ng e2e","affected:apps":"nx affected:apps","affected:libs":"nx affected:libs","affected:build":"nx affected:build","affected:e2e":"nx affected:e2e","affected:test":"nx affected:test","affected:lint":"nx affected:lint","affected:dep-graph":"nx affected:dep-graph","affected":"nx affected","format":"nx format:write","format:write":"nx format:write","format:check":"nx format:check","update":"nx migrate latest","workspace-generator":"nx workspace-generator","dep-graph":"nx dep-graph","help":"nx help","i18n:extract":"ngx-translate-extract --input ./apps/admin-panel/src --output ./apps/admin-panel/src/assets/i18n/{en,es,bn,de,hi,ko,id,ja,pt,ru,ur,zh,fr,ar,hy}.json --clean --format namespaced-json","typeorm":"node --require ts-node/register ./node_modules/typeorm/cli.js","semantic-release":"semantic-release"},"private":true,"dependencies":{"@angular/animations":"19.2.8","@angular/cdk":"19.2.11","@angular/common":"19.2.8","@angular/compiler":"19.2.8","@angular/core":"19.2.8","@angular/forms":"19.2.8","@angular/google-maps":"19.2.11","@angular/platform-browser":"19.2.8","@angular/platform-browser-dynamic":"19.2.8","@angular/router":"19.2.8","@angular/service-worker":"19.2.8","@ant-design/icons-angular":"17.0.0","@antv/g2":"^4.2.10","@apollo/client":"^3.7.17","@apollo/server":"^4.9.1","@as-integrations/fastify":"^2.1.0","@fastify/cors":"^8.3.0","@fastify/multipart":"^7.7.3","@fastify/static":"^6.10.2","@googlemaps/google-maps-services-js":"^3.3.34","@ingameltd/payu":"^1.0.5","@nestjs/apollo":"12.0.11","@nestjs/axios":"^3.0.1","@nestjs/common":"10.3.1","@nestjs/config":"^3.1.1","@nestjs/core":"10.3.1","@nestjs/graphql":"^12.0.11","@nestjs/jwt":"^10.2.0","@nestjs/passport":"^10.0.0","@nestjs/platform-fastify":"^10.3.1","@nestjs/schedule":"^4.0.0","@nestjs/serve-static":"^4.0.0","@nestjs/typeorm":"10.0.1","@nestjs/websockets":"^10.3.1","@nx/angular":"20.8.1","@nx/web":"20.8.1","@paypal/checkout-server-sdk":"^1.0.3","@ptc-org/nestjs-query-core":"^4.2.0","@ptc-org/nestjs-query-graphql":"^4.2.0","@ptc-org/nestjs-query-typeorm":"^4.2.0","@songkeys/nestjs-redis":"^10.0.0","apollo-angular":"^6.0.0","autoprefixer":"^10.4.14","class-transformer":"0.5.1","class-validator":"0.14.0","core-js":"^3.37.0","dataloader":"^2.2.2","dotenv":"16.3.1","fastify":"5.2.2","firebase-admin":"^12.6.0","graphql":"^16.7.1","graphql-redis-subscriptions":"^2.6.0","graphql-relay":"^0.10.0","graphql-subscriptions":"^2.0.0","graphql-tools":"^9.0.0","handlebars":"^4.7.7","instamojo-payment-nodejs":"^3.0.0","ioredis":"^5.3.2","json-2-csv":"^4.0.0","jwt-decode":"^3.1.2","mercadopago":"^1.5.17","mysql2":"^3.9.1","ng-zorro-antd":"^17.2.0","ngx-timeago":"^3.0.0","node-rsa":"^1.1.1","overshom-wayforpay":"^1.1.0","passport":"^0.6.0","passport-jwt":"^4.0.1","passport-local":"^1.0.0","paystack-node":"^0.3.0","paytm-pg-node-sdk":"^1.0.4","paytmchecksum":"^1.5.1","plivo":"^4.60.1","razorpay":"^2.9.1","reflect-metadata":"^0.1.13","rxjs":"^7.8.1","sberbank-acquiring":"^1.2.1","stripe":"^12.14.0","tslib":"^2.6.1","twilio":"^4.17.0","typeorm":"0.3.17","zone.js":"0.15.0"},"devDependencies":{"@angular-devkit/build-angular":"19.2.9","@angular-devkit/core":"19.2.9","@angular-devkit/schematics":"19.2.9","@angular-eslint/eslint-plugin":"19.2.0","@angular-eslint/eslint-plugin-template":"19.2.0","@angular-eslint/template-parser":"19.2.0","@angular/cli":"~19.2.0","@angular/compiler-cli":"19.2.8","@angular/language-service":"19.2.8","@bartholomej/ngx-translate-extract":"^8.0.2","@graphql-codegen/cli":"^5.0.0","@graphql-codegen/introspection":"^4.0.0","@graphql-codegen/typescript":"^4.0.1","@graphql-codegen/typescript-apollo-angular":"^4.0.0","@graphql-codegen/typescript-operations":"^4.0.1","@nestjs/schematics":"10.1.0","@nestjs/testing":"10.3.1","@ngx-translate/core":"^15.0.0","@ngx-translate/http-loader":"^8.0.0","@nx/eslint":"20.8.1","@nx/eslint-plugin":"20.8.1","@nx/jest":"20.8.1","@nx/js":"20.8.1","@nx/nest":"20.8.1","@nx/node":"20.8.1","@nx/workspace":"20.8.1","@parcel/watcher":"^2.3.0","@schematics/angular":"19.2.9","@semantic-release/changelog":"^6.0.3","@semantic-release/commit-analyzer":"^10.0.1","@semantic-release/git":"^10.0.1","@semantic-release/gitlab":"^12.0.3","@semantic-release/npm":"^10.0.4","@semantic-release/release-notes-generator":"^11.0.4","@tailwindcss/forms":"^0.5.4","@tailwindcss/typography":"^0.5.9","@types/busboy":"^1.5.0","@types/cron":"^2.0.1","@types/estree":"1.0.1","@types/ioredis":"^5.0.0","@types/jest":"29.5.14","@types/node":"^18.16.9","@types/paypal__checkout-server-sdk":"^1.0.5","@typescript-eslint/eslint-plugin":"7.16.0","@typescript-eslint/parser":"7.16.0","@typescript-eslint/utils":"^7.16.0","conventional-changelog-conventionalcommits":"^6.1.0","eslint":"8.57.1","eslint-config-prettier":"10.0.0","jest":"29.7.0","jest-environment-jsdom":"29.7.0","jest-preset-angular":"14.4.2","json-autotranslate":"^1.11.0","ng-packagr":"19.2.2","nx":"20.8.1","postcss":"^8.4.27","postcss-import":"15.1.0","postcss-preset-env":"9.1.0","postcss-url":"10.1.3","prettier":"3.0.0","semantic-release":"^21.0.7","semantic-release-npm-github-publish":"^1.5.4","semantic-release-plus":"^20.0.0","tailwindcss":"^3.3.3","ts-jest":"29.1.1","ts-node":"10.9.1","typescript":"^5.2.2"},"overrides":{"@googlemaps/url-signature":"1.0.32"},"repository":{"type":"git","url":"https://github.com/ridyio/ridy-monorepo.git"},"publishConfig":{"access":"restricted"}}');

/***/ }),
/* 194 */
/***/ ((module) => {

module.exports = require("firebase-admin/app");

/***/ }),
/* 195 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnnouncementModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const announcement_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/announcement.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const announcement_dto_1 = __webpack_require__(196);
const jwt_auth_guard_1 = __webpack_require__(133);
const announcement_input_1 = __webpack_require__(198);
let AnnouncementModule = class AnnouncementModule {
};
exports.AnnouncementModule = AnnouncementModule;
exports.AnnouncementModule = AnnouncementModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([announcement_entity_1.AnnouncementEntity])],
                resolvers: [
                    {
                        EntityClass: announcement_entity_1.AnnouncementEntity,
                        DTOClass: announcement_dto_1.AnnouncementDTO,
                        CreateDTOClass: announcement_input_1.AnnouncementInput,
                        UpdateDTOClass: announcement_input_1.AnnouncementInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], AnnouncementModule);


/***/ }),
/* 196 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnnouncementDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const announcement_authorizer_1 = __webpack_require__(197);
let AnnouncementDTO = class AnnouncementDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, title: { type: () => String }, description: { type: () => String }, url: { nullable: true, type: () => String }, userType: { type: () => [Object] }, startAt: { type: () => Date }, expireAt: { type: () => Date } };
    }
};
exports.AnnouncementDTO = AnnouncementDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], AnnouncementDTO.prototype, "id", void 0);
exports.AnnouncementDTO = AnnouncementDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Announcement'),
    (0, nestjs_query_graphql_1.Authorize)(announcement_authorizer_1.AnnouncementAuthorizer)
], AnnouncementDTO);


/***/ }),
/* 197 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnnouncementAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let AnnouncementAuthorizer = class AnnouncementAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: {
                role: true,
            },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Announcements_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Announcements_Edit)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.AnnouncementAuthorizer = AnnouncementAuthorizer;
exports.AnnouncementAuthorizer = AnnouncementAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], AnnouncementAuthorizer);


/***/ }),
/* 198 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnnouncementInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let AnnouncementInput = class AnnouncementInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { title: { type: () => String }, description: { type: () => String }, url: { nullable: true, type: () => String }, userType: { type: () => [Object] }, startAt: { type: () => Date }, expireAt: { type: () => Date } };
    }
};
exports.AnnouncementInput = AnnouncementInput;
exports.AnnouncementInput = AnnouncementInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], AnnouncementInput);


/***/ }),
/* 199 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(200);
const passport_1 = __webpack_require__(134);
const operator_module_1 = __webpack_require__(201);
const auth_resolver_1 = __webpack_require__(207);
const auth_service_1 = __webpack_require__(208);
const jwt_strategy_1 = __webpack_require__(210);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            operator_module_1.OperatorModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'secret',
            }),
        ],
        providers: [jwt_strategy_1.JwtStrategy, auth_service_1.AuthService, auth_resolver_1.AuthResolver],
    })
], AuthModule);


/***/ }),
/* 200 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 201 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const operator_role_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator-role.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const operator_role_dto_1 = __webpack_require__(145);
const operator_dto_1 = __webpack_require__(144);
const create_operator_input_1 = __webpack_require__(202);
const operator_service_1 = __webpack_require__(203);
const operator_resolver_1 = __webpack_require__(204);
const operator_role_input_1 = __webpack_require__(206);
let OperatorModule = class OperatorModule {
};
exports.OperatorModule = OperatorModule;
exports.OperatorModule = OperatorModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        operator_entity_1.OperatorEntity,
                        operator_role_entity_1.OperatorRoleEntity,
                    ]),
                ],
                resolvers: [
                    {
                        EntityClass: operator_role_entity_1.OperatorRoleEntity,
                        DTOClass: operator_role_dto_1.OperatorRoleDTO,
                        CreateDTOClass: operator_role_input_1.OperatorRoleInput,
                        UpdateDTOClass: operator_role_input_1.OperatorRoleInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: operator_entity_1.OperatorEntity,
                        DTOClass: operator_dto_1.OperatorDTO,
                        CreateDTOClass: create_operator_input_1.CreateOperatorInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
        providers: [operator_service_1.OperatorService, operator_resolver_1.OperatorResolver],
        exports: [operator_service_1.OperatorService],
    })
], OperatorModule);


/***/ }),
/* 202 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateOperatorInput = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const operator_authorizer_1 = __webpack_require__(146);
let CreateOperatorInput = class CreateOperatorInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { firstName: { nullable: true, type: () => String }, lastName: { nullable: true, type: () => String }, userName: { type: () => String }, password: { type: () => String }, mobileNumber: { type: () => String }, email: { nullable: true, type: () => String } };
    }
};
exports.CreateOperatorInput = CreateOperatorInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], CreateOperatorInput.prototype, "roleId", void 0);
exports.CreateOperatorInput = CreateOperatorInput = tslib_1.__decorate([
    (0, graphql_1.InputType)(),
    (0, nestjs_query_graphql_1.Authorize)(operator_authorizer_1.OperatorAuthorizer)
], CreateOperatorInput);


/***/ }),
/* 203 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const apollo_1 = __webpack_require__(5);
const typeorm_2 = __webpack_require__(11);
let OperatorService = class OperatorService {
    constructor(repo) {
        this.repo = repo;
    }
    async validateCredentials(userName, password) {
        return this.repo.findOneBy({ userName, password });
    }
    async getById(id) {
        return this.repo.findOneBy({ id });
    }
    async hasPermission(id, permission) {
        const operator = await this.repo.findOneOrFail({
            where: { id },
            relations: { role: true },
        });
        const hasPermission = operator.role.permissions.includes(permission);
        if (!hasPermission)
            throw new apollo_1.ForbiddenError('PERMISSION_NOT_GRANTED');
        return operator;
    }
    async hasPermissionBoolean(id, permission) {
        const operator = await this.repo.findOneOrFail({
            where: { id },
            relations: { role: true },
        });
        return operator.role.permissions.includes(permission);
    }
};
exports.OperatorService = OperatorService;
exports.OperatorService = OperatorService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(operator_entity_1.OperatorEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], OperatorService);


/***/ }),
/* 204 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorResolver = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const apollo_1 = __webpack_require__(5);
const jwt_auth_guard_1 = __webpack_require__(133);
const operator_dto_1 = __webpack_require__(144);
const update_password_input_1 = __webpack_require__(205);
const operator_service_1 = __webpack_require__(203);
let OperatorResolver = class OperatorResolver {
    constructor(service, context) {
        this.service = service;
        this.context = context;
    }
    async updatePassword(input) {
        if (process.env.DEMO_MODE != null) {
            throw new apollo_1.ForbiddenError('Action not allowed in demo mode.');
        }
        const operator = await this.service.getById(this.context.req.user.id);
        if (operator.password != input.oldPassword) {
            throw new apollo_1.ForbiddenError("Old password don't match");
        }
        await this.service.repo.update(operator.id, { password: input.newPasswod });
        operator.password = input.newPasswod;
        return operator;
    }
};
exports.OperatorResolver = OperatorResolver;
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => operator_dto_1.OperatorDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => update_password_input_1.UpdatePasswordInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_password_input_1.UpdatePasswordInput]),
    tslib_1.__metadata("design:returntype", Promise)
], OperatorResolver.prototype, "updatePassword", null);
exports.OperatorResolver = OperatorResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(1, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [operator_service_1.OperatorService, Object])
], OperatorResolver);


/***/ }),
/* 205 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePasswordInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let UpdatePasswordInput = class UpdatePasswordInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { oldPassword: { type: () => String }, newPasswod: { type: () => String } };
    }
};
exports.UpdatePasswordInput = UpdatePasswordInput;
exports.UpdatePasswordInput = UpdatePasswordInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], UpdatePasswordInput);


/***/ }),
/* 206 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OperatorRoleInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let OperatorRoleInput = class OperatorRoleInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { title: { type: () => String }, permissions: { type: () => [Object] } };
    }
};
exports.OperatorRoleInput = OperatorRoleInput;
exports.OperatorRoleInput = OperatorRoleInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], OperatorRoleInput);


/***/ }),
/* 207 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthResolver = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const operator_dto_1 = __webpack_require__(144);
const auth_service_1 = __webpack_require__(208);
const token_dto_1 = __webpack_require__(209);
const jwt_auth_guard_1 = __webpack_require__(133);
let AuthResolver = class AuthResolver {
    constructor(authService, context) {
        this.authService = authService;
        this.context = context;
    }
    //@UseGuards(LocalAdminAuthGuard)
    async login(userName, password) {
        const token = await this.authService.loginAdmin({ userName, password });
        return {
            token
        };
    }
    async me() {
        return this.authService.getAdmin(this.context.req.user.id);
    }
};
exports.AuthResolver = AuthResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => token_dto_1.TokenObject),
    tslib_1.__param(0, (0, graphql_1.Args)('userName', { type: () => String })),
    tslib_1.__param(1, (0, graphql_1.Args)('password', { type: () => String })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => operator_dto_1.OperatorDTO),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AuthResolver.prototype, "me", null);
exports.AuthResolver = AuthResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    tslib_1.__param(1, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService, Object])
], AuthResolver);


/***/ }),
/* 208 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(200);
const apollo_1 = __webpack_require__(5);
const operator_service_1 = __webpack_require__(203);
let AuthService = class AuthService {
    constructor(jwtService, adminService) {
        this.jwtService = jwtService;
        this.adminService = adminService;
    }
    async getAdmin(id) {
        return this.adminService.getById(id);
    }
    async loginAdmin(args) {
        const admin = await this.adminService.validateCredentials(args.userName, args.password);
        if (admin == null) {
            throw new apollo_1.ForbiddenError('Invalid Credentials');
        }
        return this.jwtService.sign({ id: admin.id });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [jwt_1.JwtService,
        operator_service_1.OperatorService])
], AuthService);


/***/ }),
/* 209 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenObject = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let TokenObject = class TokenObject {
    static _GRAPHQL_METADATA_FACTORY() {
        return { token: { type: () => String } };
    }
};
exports.TokenObject = TokenObject;
exports.TokenObject = TokenObject = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], TokenObject);


/***/ }),
/* 210 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
exports.validateToken = validateToken;
const tslib_1 = __webpack_require__(1);
const passport_jwt_1 = __webpack_require__(211);
const passport_1 = __webpack_require__(134);
const common_1 = __webpack_require__(2);
const jwt_decode_1 = tslib_1.__importDefault(__webpack_require__(212));
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret',
        });
    }
    async validate(payload) {
        return payload;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtStrategy);
async function validateToken(token) {
    const res = (0, jwt_decode_1.default)(token);
    return {
        id: res.id,
    };
}


/***/ }),
/* 211 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 212 */
/***/ ((module) => {

module.exports = require("jwt-decode");

/***/ }),
/* 213 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const car_color_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/car-color.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const car_model_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/car-model.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const car_color_dto_1 = __webpack_require__(214);
const car_model_dto_1 = __webpack_require__(216);
const car_color_input_1 = __webpack_require__(217);
const car_model_input_1 = __webpack_require__(218);
let CarModule = class CarModule {
};
exports.CarModule = CarModule;
exports.CarModule = CarModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([car_color_entity_1.CarColorEntity, car_model_entity_1.CarModelEntity]),
                ],
                resolvers: [
                    {
                        EntityClass: car_model_entity_1.CarModelEntity,
                        DTOClass: car_model_dto_1.CarModelDTO,
                        CreateDTOClass: car_model_input_1.CarModelInput,
                        UpdateDTOClass: car_model_input_1.CarModelInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: car_color_entity_1.CarColorEntity,
                        DTOClass: car_color_dto_1.CarColorDTO,
                        CreateDTOClass: car_color_input_1.CarColorInput,
                        UpdateDTOClass: car_color_input_1.CarColorInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], CarModule);


/***/ }),
/* 214 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarColorDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const car_authorizer_1 = __webpack_require__(215);
let CarColorDTO = class CarColorDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String } };
    }
};
exports.CarColorDTO = CarColorDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], CarColorDTO.prototype, "id", void 0);
exports.CarColorDTO = CarColorDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('CarColor'),
    (0, nestjs_query_graphql_1.Authorize)(car_authorizer_1.CarAuthorizer)
], CarColorDTO);


/***/ }),
/* 215 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let CarAuthorizer = class CarAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: { role: true },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Cars_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Cars_Edit)) {
            if (authorizerContext.operationGroup === 'create' ||
                authorizerContext.operationGroup === 'update' ||
                authorizerContext.operationGroup === 'delete') {
                throw new common_1.UnauthorizedException();
            }
        }
        return undefined;
    }
};
exports.CarAuthorizer = CarAuthorizer;
exports.CarAuthorizer = CarAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], CarAuthorizer);


/***/ }),
/* 216 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarModelDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const car_authorizer_1 = __webpack_require__(215);
let CarModelDTO = class CarModelDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String } };
    }
};
exports.CarModelDTO = CarModelDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], CarModelDTO.prototype, "id", void 0);
exports.CarModelDTO = CarModelDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('CarModel'),
    (0, nestjs_query_graphql_1.Authorize)(car_authorizer_1.CarAuthorizer)
], CarModelDTO);


/***/ }),
/* 217 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarColorInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let CarColorInput = class CarColorInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.CarColorInput = CarColorInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], CarColorInput.prototype, "name", void 0);
exports.CarColorInput = CarColorInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CarColorInput);


/***/ }),
/* 218 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarModelInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let CarModelInput = class CarModelInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.CarModelInput = CarModelInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], CarModelInput.prototype, "name", void 0);
exports.CarModelInput = CarModelInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CarModelInput);


/***/ }),
/* 219 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const database_1 = __webpack_require__(9);
const complaint_activity_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/complaint-activity.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const complaint_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/complaint.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const complaint_subscription_service_1 = __webpack_require__(220);
const complaint_activity_dto_1 = __webpack_require__(149);
const complaint_dto_1 = __webpack_require__(148);
let ComplaintModule = class ComplaintModule {
};
exports.ComplaintModule = ComplaintModule;
exports.ComplaintModule = ComplaintModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        complaint_entity_1.ComplaintEntity,
                        complaint_activity_entity_1.ComplaintActivityEntity,
                    ]),
                ],
                resolvers: [
                    {
                        EntityClass: complaint_entity_1.ComplaintEntity,
                        DTOClass: complaint_dto_1.ComplaintDTO,
                        create: { disabled: true },
                        update: { many: { disabled: true } },
                        delete: { disabled: true },
                        enableAggregate: true,
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: complaint_activity_entity_1.ComplaintActivityEntity,
                        DTOClass: complaint_activity_dto_1.ComplaintActivityDTO,
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        update: { disabled: true },
                        delete: { disabled: true },
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
        providers: [complaint_subscription_service_1.ComplaintSubscriptionService, database_1.RedisPubSubProvider.provider()],
    })
], ComplaintModule);


/***/ }),
/* 220 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintSubscriptionService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const graphql_redis_subscriptions_1 = __webpack_require__(105);
const complaint_dto_1 = __webpack_require__(148);
let ComplaintSubscriptionService = class ComplaintSubscriptionService {
    constructor(pubSub) {
        this.pubSub = pubSub;
    }
    complaintCreated() {
        return this.pubSub.asyncIterator('complaintCreated');
    }
};
exports.ComplaintSubscriptionService = ComplaintSubscriptionService;
tslib_1.__decorate([
    (0, graphql_1.Subscription)(() => complaint_dto_1.ComplaintDTO, {
        filter: (payload, variables, context) => {
            return payload.adminIds.includes(context.user.id);
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ComplaintSubscriptionService.prototype, "complaintCreated", null);
exports.ComplaintSubscriptionService = ComplaintSubscriptionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_query_graphql_1.InjectPubSub)()),
    tslib_1.__metadata("design:paramtypes", [graphql_redis_subscriptions_1.RedisPubSub])
], ComplaintSubscriptionService);


/***/ }),
/* 221 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationModule = void 0;
const tslib_1 = __webpack_require__(1);
const axios_1 = __webpack_require__(6);
const common_1 = __webpack_require__(2);
const configuration_controller_1 = __webpack_require__(222);
const configuration_resolver_1 = __webpack_require__(227);
const configuration_service_1 = __webpack_require__(223);
let ConfigurationModule = class ConfigurationModule {
};
exports.ConfigurationModule = ConfigurationModule;
exports.ConfigurationModule = ConfigurationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
        ],
        providers: [
            configuration_service_1.ConfigurationService,
            configuration_resolver_1.ConfigurationResolver
        ],
        controllers: [
            configuration_controller_1.ConfigurationController
        ]
    })
], ConfigurationModule);


/***/ }),
/* 222 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const fastify = tslib_1.__importStar(__webpack_require__(187));
const configuration_service_1 = __webpack_require__(223);
let ConfigurationController = class ConfigurationController {
    constructor(configurationService) {
        this.configurationService = configurationService;
    }
    async upload(req, res) {
        this.configurationService.uploadFile(req, res, 'config');
    }
};
exports.ConfigurationController = ConfigurationController;
tslib_1.__decorate([
    (0, common_1.Post)('upload'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationController.prototype, "upload", null);
exports.ConfigurationController = ConfigurationController = tslib_1.__decorate([
    (0, common_1.Controller)('config'),
    tslib_1.__metadata("design:paramtypes", [configuration_service_1.ConfigurationService])
], ConfigurationController);


/***/ }),
/* 223 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationService = void 0;
const tslib_1 = __webpack_require__(1);
const axios_1 = __webpack_require__(6);
const common_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(124);
const config_dto_1 = __webpack_require__(224);
const fs = tslib_1.__importStar(__webpack_require__(122));
const util = tslib_1.__importStar(__webpack_require__(191));
const path_1 = __webpack_require__(127);
const stream_1 = __webpack_require__(192);
const apollo_1 = __webpack_require__(5);
const pump = util.promisify(stream_1.pipeline);
let ConfigurationService = class ConfigurationService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getLicenseInformation() {
        const licenseInformation = global.license;
        return {
            buyerName: licenseInformation.buyerName,
            licenseType: licenseInformation.licenseType,
            supportExpireDate: new Date(licenseInformation.supportExpiry),
            connectedApps: licenseInformation.connectedApps,
        };
    }
    async getConfiguration() {
        const configAddress = `${process.cwd()}/config/config.${process.env.NODE_ENV ?? 'production'}.json`;
        if (fs.existsSync(configAddress)) {
            const file = await fs.promises.readFile(configAddress, {
                encoding: 'utf-8',
            });
            const config = JSON.parse(file);
            return config;
        }
        else {
            return new config_dto_1.CurrentConfiguration();
        }
    }
    async saveConfiguration(newConfig) {
        const config = await this.getConfiguration();
        if (process.env.DEMO_MODE != null) {
            throw new apollo_1.ForbiddenError('Cannot change configuration in demo mode.');
        }
        const finalConfig = Object.assign(config, newConfig);
        const str = JSON.stringify(finalConfig);
        await fs.promises.mkdir(`${process.cwd()}/config`, { recursive: true });
        await fs.promises.writeFile(`${process.cwd()}/config/config.${process.env.NODE_ENV ?? 'production'}.json`, str);
        return true;
    }
    async updateConfig(input) {
        if (process.env.DEMO_MODE != null) {
            throw new apollo_1.ForbiddenError('Cannot change configuration in demo mode.');
        }
        await this.saveConfiguration(input);
        return input;
    }
    maskString(str) {
        if (str == null) {
            return null;
        }
        return str
            .split('')
            .map(() => '*')
            .join('');
    }
    async updatePurchaseCode(code, email) {
        let url = `http://31.220.15.49:9000/verify?purchaseCode=${code}&port=4001`;
        if (email) {
            url += `&email=${email}`;
        }
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
        if (result.data.status == 'OK') {
            await this.saveConfiguration({ purchaseCode: code });
            return {
                status: config_dto_1.UpdatePurchaseCodeStatus.OK,
                data: {
                    license: {
                        buyerName: result.data?.data?.buyerName ?? 'Unknown',
                        licenseType: result.data?.data?.licenseType ?? config_dto_1.LicenseType.Regular,
                        supportExpireDate: result.data?.data != null
                            ? new Date(result.data?.data?.supportExpiry)
                            : new Date(),
                        connectedApps: result.data?.data?.connectedApps ?? [],
                    },
                    benefits: result.data?.data?.benefits ?? [],
                    drawbacks: result.data?.data?.drawbacks ?? [],
                    availableUpgrades: result.data?.data?.availableUpgrades ?? [],
                },
            };
        }
        else if (result.data.status == 'USED') {
            return {
                status: config_dto_1.UpdatePurchaseCodeStatus.CLIENT_FOUND,
                clients: result.data.clients,
            };
        }
        else {
            return {
                status: config_dto_1.UpdatePurchaseCodeStatus.INVALID,
            };
        }
    }
    async updateMapsAPIKey(backend, adminPanel) {
        await this.saveConfiguration({
            backendMapsAPIKey: backend,
            adminPanelAPIKey: adminPanel,
        });
        return {
            status: config_dto_1.UpdateConfigStatus.OK,
        };
    }
    async updateFirebase(keyFileName) {
        await this.saveConfiguration({ firebaseProjectPrivateKey: keyFileName });
        setTimeout(async () => {
            common_1.Logger.log('Restarting services', 'Configuration');
            await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://taxi-rider-api:3000/restart'));
            await (0, rxjs_1.firstValueFrom)(this.httpService.get('http://taxi-driver-api:3000/restart'));
            process.exit(0);
        }, 1000);
        return {
            status: config_dto_1.UpdateConfigStatus.OK,
        };
    }
    async disablePreviousServer(input) {
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://31.220.15.49:9000/disable_one?ip=${input.ip}`));
        if (result.data.status == 'OK') {
            return { status: config_dto_1.UpdateConfigStatus.OK };
        }
        else {
            return { status: config_dto_1.UpdateConfigStatus.INVALID };
        }
    }
    async uploadFile(req, res, dir, fileNamePrefix) {
        let _fileName = '';
        const data = await req.file();
        await fs.promises.mkdir(dir, { recursive: true });
        _fileName = (0, path_1.join)(dir, fileNamePrefix != null
            ? `${fileNamePrefix}-${data.filename}`
            : data.filename);
        await pump(data.file, fs.createWriteStream(_fileName));
        res.code(200).send({ address: _fileName });
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService])
], ConfigurationService);


/***/ }),
/* 224 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateConfigResult = exports.LicenseType = exports.AppType = exports.UpdateConfigStatus = exports.AvaialbeUpgrade = exports.UpdatePurchaseCodeData = exports.UpdatePurchaseCodeClient = exports.UpdatePurchaseCodeResult = exports.UpdatePurchaseCodeStatus = exports.UploadResult = exports.CurrentConfiguration = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(224);
const eager_import_1 = __webpack_require__(225);
const graphql_1 = __webpack_require__(7);
const app_config_info_dto_1 = __webpack_require__(226);
let CurrentConfiguration = class CurrentConfiguration {
    static _GRAPHQL_METADATA_FACTORY() {
        return { purchaseCode: { nullable: true, type: () => String }, backendMapsAPIKey: { nullable: true, type: () => String }, adminPanelAPIKey: { nullable: true, type: () => String }, firebaseProjectPrivateKey: { nullable: true, type: () => String }, versionNumber: { nullable: true, type: () => Number }, companyLogo: { nullable: true, type: () => String }, companyName: { nullable: true, type: () => String }, mysqlHost: { nullable: true, type: () => String }, mysqlPort: { nullable: true, type: () => String }, mysqlUser: { nullable: true, type: () => String }, mysqlPassword: { nullable: true, type: () => String }, mysqlDatabase: { nullable: true, type: () => String }, redisHost: { nullable: true, type: () => String }, redisPort: { nullable: true, type: () => String }, redisPassword: { nullable: true, type: () => String } };
    }
};
exports.CurrentConfiguration = CurrentConfiguration;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => app_config_info_dto_1.AppConfigInfo, { nullable: true }),
    tslib_1.__metadata("design:type", app_config_info_dto_1.AppConfigInfo)
], CurrentConfiguration.prototype, "taxi", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => app_config_info_dto_1.AppConfigInfo, { nullable: true }),
    tslib_1.__metadata("design:type", app_config_info_dto_1.AppConfigInfo)
], CurrentConfiguration.prototype, "shop", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => app_config_info_dto_1.AppConfigInfo, { nullable: true }),
    tslib_1.__metadata("design:type", app_config_info_dto_1.AppConfigInfo)
], CurrentConfiguration.prototype, "parking", void 0);
exports.CurrentConfiguration = CurrentConfiguration = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], CurrentConfiguration);
let UploadResult = class UploadResult {
    static _GRAPHQL_METADATA_FACTORY() {
        return { url: { type: () => String } };
    }
};
exports.UploadResult = UploadResult;
exports.UploadResult = UploadResult = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], UploadResult);
var UpdatePurchaseCodeStatus;
(function (UpdatePurchaseCodeStatus) {
    UpdatePurchaseCodeStatus["OK"] = "OK";
    UpdatePurchaseCodeStatus["INVALID"] = "INVALID";
    UpdatePurchaseCodeStatus["OVERUSED"] = "OVERUSED";
    UpdatePurchaseCodeStatus["CLIENT_FOUND"] = "CLIENT_FOUND";
})(UpdatePurchaseCodeStatus || (exports.UpdatePurchaseCodeStatus = UpdatePurchaseCodeStatus = {}));
(0, graphql_1.registerEnumType)(UpdatePurchaseCodeStatus, {
    name: 'UpdatePurchaseCodeStatus',
});
let UpdatePurchaseCodeResult = class UpdatePurchaseCodeResult {
    static _GRAPHQL_METADATA_FACTORY() {
        return { status: { type: () => (__webpack_require__(224).UpdatePurchaseCodeStatus) }, message: { nullable: true, type: () => String }, data: { nullable: true, type: () => (__webpack_require__(224).UpdatePurchaseCodeData) }, clients: { nullable: true, type: () => [(__webpack_require__(224).UpdatePurchaseCodeClient)] } };
    }
};
exports.UpdatePurchaseCodeResult = UpdatePurchaseCodeResult;
exports.UpdatePurchaseCodeResult = UpdatePurchaseCodeResult = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], UpdatePurchaseCodeResult);
let UpdatePurchaseCodeClient = class UpdatePurchaseCodeClient {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, enabled: { type: () => Number }, ip: { type: () => String }, port: { type: () => Number }, token: { type: () => String }, purchase_id: { type: () => Number }, first_verified_at: { type: () => String }, last_verified_at: { type: () => String } };
    }
};
exports.UpdatePurchaseCodeClient = UpdatePurchaseCodeClient;
exports.UpdatePurchaseCodeClient = UpdatePurchaseCodeClient = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], UpdatePurchaseCodeClient);
let UpdatePurchaseCodeData = class UpdatePurchaseCodeData {
    static _GRAPHQL_METADATA_FACTORY() {
        return { license: { type: () => (__webpack_require__(225).LicenseInformationDto) }, benefits: { type: () => [String] }, drawbacks: { type: () => [String] }, availableUpgrades: { type: () => [(__webpack_require__(224).AvaialbeUpgrade)] } };
    }
};
exports.UpdatePurchaseCodeData = UpdatePurchaseCodeData;
exports.UpdatePurchaseCodeData = UpdatePurchaseCodeData = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], UpdatePurchaseCodeData);
let AvaialbeUpgrade = class AvaialbeUpgrade {
    static _GRAPHQL_METADATA_FACTORY() {
        return { type: { type: () => String }, price: { type: () => Number }, benefits: { type: () => [String] } };
    }
};
exports.AvaialbeUpgrade = AvaialbeUpgrade;
exports.AvaialbeUpgrade = AvaialbeUpgrade = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], AvaialbeUpgrade);
var UpdateConfigStatus;
(function (UpdateConfigStatus) {
    UpdateConfigStatus["OK"] = "OK";
    UpdateConfigStatus["INVALID"] = "INVALID";
})(UpdateConfigStatus || (exports.UpdateConfigStatus = UpdateConfigStatus = {}));
(0, graphql_1.registerEnumType)(UpdateConfigStatus, { name: 'UpdateConfigStatus' });
var AppType;
(function (AppType) {
    AppType["Taxi"] = "taxi";
    AppType["Shop"] = "shop";
    AppType["Parking"] = "parking";
})(AppType || (exports.AppType = AppType = {}));
(0, graphql_1.registerEnumType)(AppType, { name: 'AppType' });
var LicenseType;
(function (LicenseType) {
    LicenseType["Regular"] = "Regular";
    LicenseType["Extended"] = "Extended";
    LicenseType["Bronze"] = "Bronze";
    LicenseType["Silver"] = "Silver";
    LicenseType["Gold"] = "Gold";
})(LicenseType || (exports.LicenseType = LicenseType = {}));
(0, graphql_1.registerEnumType)(LicenseType, { name: 'LicenseType' });
let UpdateConfigResult = class UpdateConfigResult {
    static _GRAPHQL_METADATA_FACTORY() {
        return { status: { type: () => (__webpack_require__(224).UpdateConfigStatus) }, message: { nullable: true, type: () => String } };
    }
};
exports.UpdateConfigResult = UpdateConfigResult;
exports.UpdateConfigResult = UpdateConfigResult = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], UpdateConfigResult);


/***/ }),
/* 225 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LicenseInformationDto = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(224);
const graphql_1 = __webpack_require__(7);
let LicenseInformationDto = class LicenseInformationDto {
    static _GRAPHQL_METADATA_FACTORY() {
        return { buyerName: { type: () => String }, licenseType: { type: () => (__webpack_require__(224).LicenseType) }, supportExpireDate: { type: () => Date }, connectedApps: { type: () => [(__webpack_require__(224).AppType)] } };
    }
};
exports.LicenseInformationDto = LicenseInformationDto;
exports.LicenseInformationDto = LicenseInformationDto = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('LicenseInformation')
], LicenseInformationDto);


/***/ }),
/* 226 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppConfigInfo = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let AppConfigInfo = class AppConfigInfo {
    static _GRAPHQL_METADATA_FACTORY() {
        return { logo: { type: () => String }, name: { type: () => String }, color: { type: () => String } };
    }
};
exports.AppConfigInfo = AppConfigInfo;
exports.AppConfigInfo = AppConfigInfo = tslib_1.__decorate([
    (0, graphql_1.InputType)('AppConfigInfoInput'),
    (0, graphql_1.ObjectType)()
], AppConfigInfo);


/***/ }),
/* 227 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationResolver = void 0;
const tslib_1 = __webpack_require__(1);
// apps/admin-api/src/app/config/configuration.resolver.ts
const graphql_1 = __webpack_require__(7);
const common_1 = __webpack_require__(2); // Import UseGuards
const config_dto_1 = __webpack_require__(224); // Adjusted path potentially
const configuration_service_1 = __webpack_require__(223);
// import { UpdateConfigInput } from './update-config.input'; // Old input
const license_dto_1 = __webpack_require__(225); // Adjusted path potentially
const config_information_dto_1 = __webpack_require__(228); // Adjusted path potentially
const update_config_input_1 = __webpack_require__(229); // Assuming this is the main config DTO
const jwt_auth_guard_1 = __webpack_require__(133); // Import Guard
// NEW: Imports for Settings
const setting_service_1 = __webpack_require__(230); // Adjust path if needed
const setting_dto_1 = __webpack_require__(231);
const update_setting_input_1 = __webpack_require__(232);
let ConfigurationResolver = class ConfigurationResolver {
    constructor(configurationService, 
    // NEW: Inject SettingService
    settingService) {
        this.configurationService = configurationService;
        this.settingService = settingService;
    }
    async configInformation() {
        const config = await this.configurationService.getConfiguration();
        return {
            isValid: config.versionNumber != null && config.versionNumber != 1, // Fixed logic
            config,
        };
    }
    async licenseInformation() {
        return this.configurationService.getLicenseInformation();
    }
    // This mutation updates the main configuration file (config.json likely)
    async updateConfigurations(input) {
        await this.configurationService.updateConfig(input);
        return {
            status: config_dto_1.UpdateConfigStatus.OK,
        };
    }
    // This query gets configuration details, potentially sensitive, ensure proper handling
    async currentConfiguration() {
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
    async updatePurchaseCode(purchaseCode, email) {
        return this.configurationService.updatePurchaseCode(purchaseCode, email);
    }
    async updateMapsAPIKey(backend, adminPanel) {
        return this.configurationService.updateMapsAPIKey(backend, adminPanel);
    }
    async updateFirebase(keyFileName) {
        return this.configurationService.updateFirebase(keyFileName);
    }
    async disablePreviousServer(ip, purchaseCode) {
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
    async getSettings() {
        return this.settingService.getAllSettings();
    }
    async updateSettings(input) {
        await this.settingService.updateSettings(input);
        return true;
    }
};
exports.ConfigurationResolver = ConfigurationResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => config_information_dto_1.ConfigInformation),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "configInformation", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => license_dto_1.LicenseInformationDto, { nullable: true }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "licenseInformation", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => config_dto_1.UpdateConfigResult),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => update_config_input_1.UpdateConfigInputV2 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_config_input_1.UpdateConfigInputV2]),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "updateConfigurations", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => config_dto_1.CurrentConfiguration),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "currentConfiguration", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => config_dto_1.UpdatePurchaseCodeResult),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__param(0, (0, graphql_1.Args)('purchaseCode', { type: () => String })),
    tslib_1.__param(1, (0, graphql_1.Args)('email', { type: () => String, nullable: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "updatePurchaseCode", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => config_dto_1.UpdateConfigResult),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__param(0, (0, graphql_1.Args)('backend', { type: () => String })),
    tslib_1.__param(1, (0, graphql_1.Args)('adminPanel', { type: () => String })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "updateMapsAPIKey", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => config_dto_1.UpdateConfigResult),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__param(0, (0, graphql_1.Args)('keyFileName', { type: () => String })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "updateFirebase", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => config_dto_1.UpdateConfigResult),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Protect endpoint
    ,
    tslib_1.__param(0, (0, graphql_1.Args)('ip', { type: () => String })),
    tslib_1.__param(1, (0, graphql_1.Args)('purchaseCode', { type: () => String, nullable: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "disablePreviousServer", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [setting_dto_1.SettingDTO], { name: 'settings' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "getSettings", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { name: 'updateSettings' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => [update_setting_input_1.UpdateSettingInput] })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigurationResolver.prototype, "updateSettings", null);
exports.ConfigurationResolver = ConfigurationResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    tslib_1.__metadata("design:paramtypes", [configuration_service_1.ConfigurationService,
        setting_service_1.SettingService])
], ConfigurationResolver);
// IMPORTANT: Ensure the module that provides ConfigurationResolver (e.g., ConfigurationModule)
// imports the SettingModule from '@ridy/common/setting/setting.module' (adjust path).


/***/ }),
/* 228 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigInformation = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(224);
const graphql_1 = __webpack_require__(7);
let ConfigInformation = class ConfigInformation {
    static _GRAPHQL_METADATA_FACTORY() {
        return { isValid: { type: () => Boolean }, config: { nullable: true, type: () => (__webpack_require__(224).CurrentConfiguration) } };
    }
};
exports.ConfigInformation = ConfigInformation;
exports.ConfigInformation = ConfigInformation = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], ConfigInformation);


/***/ }),
/* 229 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateConfigInputV2 = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const app_config_info_dto_1 = __webpack_require__(226);
let UpdateConfigInputV2 = class UpdateConfigInputV2 {
    static _GRAPHQL_METADATA_FACTORY() {
        return { phoneNumber: { type: () => String }, email: { type: () => String }, firstName: { type: () => String }, lastName: { type: () => String }, password: { type: () => String }, adminPanelAPIKey: { type: () => String }, backendMapsAPIKey: { type: () => String }, companyLogo: { type: () => String }, companyName: { type: () => String }, mysqlHost: { type: () => String }, mysqlPort: { type: () => String }, mysqlUser: { type: () => String }, mysqlPassword: { type: () => String }, mysqlDatabase: { type: () => String }, redisHost: { type: () => String }, redisPort: { type: () => String }, redisPassword: { type: () => String }, firebaseProjectPrivateKey: { type: () => String } };
    }
};
exports.UpdateConfigInputV2 = UpdateConfigInputV2;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => app_config_info_dto_1.AppConfigInfo, { nullable: true }),
    tslib_1.__metadata("design:type", app_config_info_dto_1.AppConfigInfo)
], UpdateConfigInputV2.prototype, "taxi", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => app_config_info_dto_1.AppConfigInfo, { nullable: true }),
    tslib_1.__metadata("design:type", app_config_info_dto_1.AppConfigInfo)
], UpdateConfigInputV2.prototype, "shop", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => app_config_info_dto_1.AppConfigInfo, { nullable: true }),
    tslib_1.__metadata("design:type", app_config_info_dto_1.AppConfigInfo)
], UpdateConfigInputV2.prototype, "parking", void 0);
exports.UpdateConfigInputV2 = UpdateConfigInputV2 = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], UpdateConfigInputV2);


/***/ }),
/* 230 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var SettingService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingService = exports.LOADER_COST_PER_HOUR_KEY = void 0;
const tslib_1 = __webpack_require__(1);
// libs/common/src/setting/setting.service.ts
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const database_1 = __webpack_require__(9); // Adjust path if needed
const typeorm_2 = __webpack_require__(11);
exports.LOADER_COST_PER_HOUR_KEY = 'loader_cost_per_hour'; // Define key constant
let SettingService = SettingService_1 = class SettingService {
    constructor(settingRepository) {
        this.settingRepository = settingRepository;
        this.logger = new common_1.Logger(SettingService_1.name);
    }
    async getSetting(key) {
        return this.settingRepository.findOneBy({ key });
    }
    async getAllSettings() {
        return this.settingRepository.find({ order: { group: 'ASC', key: 'ASC' } }); // Optional ordering
    }
    async getString(key, defaultValue) {
        try {
            const setting = await this.getSetting(key);
            return setting?.value ?? defaultValue;
        }
        catch (error) {
            this.logger.error(`Error fetching string setting for key: ${key}`, error);
            return defaultValue;
        }
    }
    async getNumber(key, defaultValue) {
        try {
            const setting = await this.getSetting(key);
            if (setting?.value) {
                const parsedValue = parseFloat(setting.value);
                if (!isNaN(parsedValue)) {
                    return parsedValue;
                }
                else {
                    this.logger.warn(`Invalid number format for setting key: ${key}. Value: ${setting.value}`);
                }
            }
            return defaultValue;
        }
        catch (error) {
            this.logger.error(`Error fetching number setting for key: ${key}`, error);
            return defaultValue;
        }
    }
    async getBoolean(key, defaultValue) {
        try {
            const setting = await this.getSetting(key);
            if (setting?.value) {
                return setting.value.toLowerCase() === 'true';
            }
            return defaultValue;
        }
        catch (error) {
            this.logger.error(`Error fetching boolean setting for key: ${key}`, error);
            return defaultValue;
        }
    }
    async getLoaderCostPerHour() {
        const cost = await this.getNumber(exports.LOADER_COST_PER_HOUR_KEY, 0);
        if (cost === 0) {
            this.logger.warn(`Setting key '${exports.LOADER_COST_PER_HOUR_KEY}' not found or is zero. Loaders will be free.`);
        }
        return cost ?? 0;
    }
    async updateSetting(key, value) {
        const setting = this.settingRepository.create({ key, value });
        return this.settingRepository.save(setting);
    }
    async updateSettings(settings) {
        const entities = settings.map(s => this.settingRepository.create(s));
        // Use save with chunking if the number of settings can be very large
        return this.settingRepository.save(entities);
    }
};
exports.SettingService = SettingService;
exports.SettingService = SettingService = SettingService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(database_1.SettingEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], SettingService);


/***/ }),
/* 231 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingDTO = void 0;
const tslib_1 = __webpack_require__(1);
// apps/admin-api/src/app/config/dto/setting.dto.ts
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104); // Assuming you might want filtering later
let SettingDTO = class SettingDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { key: { type: () => String } };
    }
};
exports.SettingDTO = SettingDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)({ description: 'Unique key for the setting' }),
    tslib_1.__metadata("design:type", String)
], SettingDTO.prototype, "key", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Value of the setting (stored as string)' }),
    tslib_1.__metadata("design:type", String)
], SettingDTO.prototype, "value", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], SettingDTO.prototype, "title", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], SettingDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], SettingDTO.prototype, "group", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], SettingDTO.prototype, "isPublic", void 0);
exports.SettingDTO = SettingDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Setting')
], SettingDTO);


/***/ }),
/* 232 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSettingInput = void 0;
const tslib_1 = __webpack_require__(1);
// apps/admin-api/src/app/config/dto/update-setting.input.ts
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(233);
let UpdateSettingInput = class UpdateSettingInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.UpdateSettingInput = UpdateSettingInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateSettingInput.prototype, "key", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    (0, class_validator_1.IsNotEmpty)() // Value can be empty string, but key must exist
    ,
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateSettingInput.prototype, "value", void 0);
exports.UpdateSettingInput = UpdateSettingInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], UpdateSettingInput);


/***/ }),
/* 233 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 234 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const coupon_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/coupon.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const coupon_dto_1 = __webpack_require__(150);
const coupon_input_1 = __webpack_require__(235);
let CouponModule = class CouponModule {
};
exports.CouponModule = CouponModule;
exports.CouponModule = CouponModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([coupon_entity_1.CouponEntity])],
                resolvers: [
                    {
                        EntityClass: coupon_entity_1.CouponEntity,
                        DTOClass: coupon_dto_1.CouponDTO,
                        CreateDTOClass: coupon_input_1.CouponInput,
                        UpdateDTOClass: coupon_input_1.CouponInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], CouponModule);


/***/ }),
/* 235 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let CouponInput = class CouponInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { code: { type: () => String }, title: { type: () => String }, description: { type: () => String }, minimumCost: { type: () => Number }, maximumCost: { type: () => Number }, startAt: { type: () => Date }, expireAt: { type: () => Date }, creditGift: { type: () => Number }, isEnabled: { type: () => Boolean }, isFirstTravelOnly: { type: () => Boolean } };
    }
};
exports.CouponInput = CouponInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponInput.prototype, "manyUsersCanUse", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponInput.prototype, "manyTimesUserCanUse", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponInput.prototype, "discountPercent", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {}),
    tslib_1.__metadata("design:type", Number)
], CouponInput.prototype, "discountFlat", void 0);
exports.CouponInput = CouponInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CouponInput);


/***/ }),
/* 236 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const driver_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_wallet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-wallet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_driver_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-driver.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const redis_helper_module_1 = __webpack_require__(237);
const jwt_auth_guard_1 = __webpack_require__(133);
const driver_resolver_1 = __webpack_require__(241);
const driver_service_1 = __webpack_require__(242);
const driver_transaction_dto_1 = __webpack_require__(158);
const driver_wallet_dto_1 = __webpack_require__(170);
const driver_dto_1 = __webpack_require__(165);
const driver_input_1 = __webpack_require__(246);
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_transaction_input_1 = __webpack_require__(244);
let DriverModule = class DriverModule {
};
exports.DriverModule = DriverModule;
exports.DriverModule = DriverModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            redis_helper_module_1.RedisHelpersModule,
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        driver_entity_1.DriverEntity,
                        driver_transaction_entity_1.DriverTransactionEntity,
                        driver_wallet_entity_1.DriverWalletEntity,
                        operator_entity_1.OperatorEntity,
                    ]),
                ],
                resolvers: [
                    {
                        EntityClass: driver_entity_1.DriverEntity,
                        DTOClass: driver_dto_1.DriverDTO,
                        UpdateDTOClass: driver_input_1.UpdateDriverInput,
                        CreateDTOClass: driver_input_1.UpdateDriverInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        enableAggregate: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: driver_wallet_entity_1.DriverWalletEntity,
                        DTOClass: driver_wallet_dto_1.DriverWalletDTO,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: driver_transaction_entity_1.DriverTransactionEntity,
                        DTOClass: driver_transaction_dto_1.DriverTransactionDTO,
                        CreateDTOClass: driver_transaction_input_1.DriverTransactionInput,
                        create: { many: { disabled: true } },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        enableAggregate: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
        providers: [driver_resolver_1.DriverResolver, driver_service_1.DriverService, shared_driver_service_1.SharedDriverService],
    })
], DriverModule);


/***/ }),
/* 237 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisHelpersModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const driver_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_wallet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-wallet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_driver_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-driver.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_redis_service_1 = __webpack_require__(238);
const order_redis_service_1 = __webpack_require__(239);
const auth_redis_service_1 = __webpack_require__(240);
let RedisHelpersModule = class RedisHelpersModule {
};
exports.RedisHelpersModule = RedisHelpersModule;
exports.RedisHelpersModule = RedisHelpersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                driver_entity_1.DriverEntity,
                driver_wallet_entity_1.DriverWalletEntity,
                driver_transaction_entity_1.DriverTransactionEntity,
            ]),
        ],
        providers: [
            driver_redis_service_1.DriverRedisService,
            order_redis_service_1.OrderRedisService,
            shared_driver_service_1.SharedDriverService,
            auth_redis_service_1.AuthRedisService,
        ],
        exports: [driver_redis_service_1.DriverRedisService, order_redis_service_1.OrderRedisService, auth_redis_service_1.AuthRedisService],
    })
], RedisHelpersModule);


/***/ }),
/* 238 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverRedisService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const nestjs_redis_1 = __webpack_require__(125);
const ioredis_1 = __webpack_require__(106);
let DriverRedisService = class DriverRedisService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async setLocation(driverId, point) {
        await Promise.all([
            this.redisService.geoadd(RedisKeys.Driver, point.lng, point.lat, driverId.toString()),
            this.redisService.zadd(RedisKeys.DriverLocationTime, Date.now(), driverId),
        ]);
        if (point.heading) {
            this.redisService.hset(RedisKeys.DriverHeading, driverId.toString(), point.heading);
        }
    }
    async getDriverCoordinate(driverId) {
        const pos = await this.redisService.geopos(RedisKeys.Driver, driverId.toString());
        const heading = await this.redisService.hget(RedisKeys.DriverHeading, driverId.toString());
        return pos[0]
            ? {
                lat: parseFloat(pos[0][1]),
                lng: parseFloat(pos[0][0]),
                heading: heading ? parseInt(heading) : undefined,
            }
            : null;
    }
    async getClose(point, distance) {
        const bare = (await this.redisService.call('GEORADIUS', RedisKeys.Driver, point.lng, point.lat, distance, 'm', 'WITHCOORD'));
        const result = bare.map(async (item) => {
            const heading = await this.redisService.hget(RedisKeys.DriverHeading, item[0]);
            return {
                driverId: parseInt(item[0]),
                location: {
                    lat: parseFloat(item[1][1]),
                    lng: parseFloat(item[1][0]),
                    heading: heading ? parseInt(heading) : undefined,
                },
            };
        });
        return Promise.all(result);
    }
    async getCloseWithoutIds(point, distance) {
        const bare = (await this.redisService.call('GEORADIUS', RedisKeys.Driver, point.lng, point.lat, distance, 'm', 'WITHCOORD'));
        const result = bare.map(async (item) => {
            const heading = await this.redisService.hget(RedisKeys.DriverHeading, item[0]);
            return {
                lat: parseFloat(item[1][1]),
                lng: parseFloat(item[1][0]),
                heading: heading ? parseInt(heading) : undefined,
            };
        });
        return Promise.all(result);
    }
    async getAllOnline(center, count) {
        const bare = (await this.redisService.call('GEORADIUS', RedisKeys.Driver, center.lng.toString(), center.lat.toString(), '22000', 'km', 'WITHCOORD', `COUNT`, count.toString(), 'ASC'));
        const times = await this.redisService.zrangebyscore(RedisKeys.DriverLocationTime, 0, new Date().getTime(), 'WITHSCORES');
        const result = bare.map(async (x) => {
            const heading = await this.redisService.hget(RedisKeys.DriverHeading, x[0]);
            return {
                driverId: parseInt(x[0]),
                location: {
                    lat: parseFloat(x[1][1]),
                    lng: parseFloat(x[1][0]),
                    heading: heading ? parseInt(heading) : undefined,
                },
                lastUpdatedAt: parseInt(times[times.indexOf(x[0]) + 1]),
            };
        });
        return Promise.all(result);
    }
    async expire(userId) {
        await this.redisService.zrem(RedisKeys.Driver, userId);
        await this.redisService.zrem(RedisKeys.DriverLocationTime, userId);
    }
};
exports.DriverRedisService = DriverRedisService;
exports.DriverRedisService = DriverRedisService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_redis_1.InjectRedis)()),
    tslib_1.__metadata("design:paramtypes", [ioredis_1.Redis])
], DriverRedisService);
var RedisKeys;
(function (RedisKeys) {
    RedisKeys["Driver"] = "driver";
    RedisKeys["DriverHeading"] = "driver-heading";
    RedisKeys["DriverLocationTime"] = "driver-location-time";
})(RedisKeys || (RedisKeys = {}));


/***/ }),
/* 239 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderRedisService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const nestjs_redis_1 = __webpack_require__(125);
const ioredis_1 = __webpack_require__(106);
const shared_driver_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-driver.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let OrderRedisService = class OrderRedisService {
    constructor(redisService, sharedDriverService) {
        this.redisService = redisService;
        this.sharedDriverService = sharedDriverService;
    }
    async add(request, minutesfromNow) {
        const date = new Date();
        const pickupTime = date.setMinutes(date.getMinutes() + minutesfromNow);
        await this.redisService.geoadd(RedisKeys.Request, request.points[0].lng, request.points[0].lat, request.id.toString());
        await this.redisService.zadd(RedisKeys.RequestTime, pickupTime, request.id);
        // await this.redisService.set(`${RedisKeys.Request}:${request.id}`, JSON.stringify(request));
        return request;
    }
    async getForDriver(driverId, distance) {
        const driverLocation = await this.redisService.geopos(RedisKeys.Driver, driverId.toString());
        if (driverLocation[0] == null) {
            return [];
        }
        const searchArea = distance ??
            (await this.sharedDriverService.getMaxRadiusForDriverServices(driverId));
        const requestIds = await this.redisService.georadius(RedisKeys.Request, parseFloat(driverLocation[0][0]), parseFloat(driverLocation[0][1]), searchArea, 'm');
        // const requests = [];
        const ts = Math.round(new Date().getTime());
        const min = ts - 20 * 60000;
        const max = ts + 30 * 60000;
        const _requests = await this.redisService.zrangebyscore(RedisKeys.RequestTime, min, max);
        const intersection = requestIds.filter((x) => _requests.includes(x));
        return intersection.map((x) => x.toString());
        // for (const requestId of intersection) {
        //     const requestString = await this.redisService.get(`${RedisKeys.Request}:${requestId}`);
        //     const request: RequestRedisDTO = JSON.parse(requestString!);
        //     if (request) {
        //         const canDo = await this.sharedDriverService.canDriverDoServiceAndFleet(driverId, request.serviceId, request.fleetIds);
        //         if(canDo) {
        //             requests.push(request);
        //         }
        //     }
        // }
        // return requests;
    }
    async driverNotified(requestId, driverIds) {
        const ids = driverIds.map((driverId) => driverId.id);
        for (let id of ids) {
            await this.redisService.sadd(`${RedisKeys.RequestDrivers}:${requestId}`, id);
        }
    }
    async getDriversNotified(requestId) {
        const driverIds = await this.redisService.smembers(`${RedisKeys.RequestDrivers}:${requestId}`);
        return driverIds.map((x) => parseInt(x));
    }
    async expire(requestIds) {
        common_1.Logger.log('Expire', 'OrderRedisService');
        for (const requestId of requestIds) {
            const zremRequest = await this.redisService.zrem(RedisKeys.Request, requestId);
            const zremRequestTime = await this.redisService.zrem(RedisKeys.RequestTime, requestId);
            const driversNotified = await this.getDriversNotified(requestId);
            for (let driver of driversNotified) {
                await this.redisService.srem(`${RedisKeys.RequestDrivers}:${requestId}`, driver);
            }
            const delRequestObject = await this.redisService.del([
                `${RedisKeys.Request}:${requestId}`,
            ]);
            common_1.Logger.log(`zremRequest: ${zremRequest} zremRequestTime: ${zremRequestTime} delRequestObject: ${delRequestObject}`, 'OrderRedisService');
        }
        common_1.Logger.log('Expire done', 'OrderRedisService');
        // this.redisService.del(
        //   requestIds.map((id) => `${RedisKeys.Request}:${id}`).join(' '),
        // ); // # This doesn't works for some reason. expire works
    }
    async getAll() {
        return this.getRequestsInTimeRange(0, -1);
    }
    async getRequestIdsInTimeRage(min, max) {
        return await this.redisService.zrange(RedisKeys.RequestTime, min, max);
    }
    async getRequestsInTimeRange(min, max) {
        const _requestIds = await this.getRequestIdsInTimeRage(min, max);
        return _requestIds;
        // const result: RequestRedisDTO[] = []
        // for(const requestId of _requestIds) {
        //     const request = await this.getOne(requestId);
        //     if(request != null) {
        //         result.push(request);
        //     }
        // }
        // return result;
    }
};
exports.OrderRedisService = OrderRedisService;
exports.OrderRedisService = OrderRedisService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_redis_1.InjectRedis)()),
    tslib_1.__metadata("design:paramtypes", [ioredis_1.Redis, typeof (_a = typeof shared_driver_service_1.SharedDriverService !== "undefined" && shared_driver_service_1.SharedDriverService) === "function" ? _a : Object])
], OrderRedisService);
var RedisKeys;
(function (RedisKeys) {
    RedisKeys["Driver"] = "driver";
    RedisKeys["Request"] = "request";
    RedisKeys["RequestDrivers"] = "request-drivers";
    RedisKeys["RequestTime"] = "request-time";
})(RedisKeys || (RedisKeys = {}));


/***/ }),
/* 240 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyHash = exports.AuthRedisService = void 0;
const tslib_1 = __webpack_require__(1);
const apollo_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const nestjs_redis_1 = __webpack_require__(125);
const ioredis_1 = tslib_1.__importDefault(__webpack_require__(106));
let AuthRedisService = class AuthRedisService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async createVerificationCode(input) {
        const hash = Math.random().toString(36).substring(7);
        const verifyHash = {
            mobileNumber: input.mobileNumber,
            countryIso: input.countryIso,
            code: input.code,
        };
        await this.redisService.hset(`verify:${hash}`, verifyHash);
        await this.redisService.expire(`verify:${hash}`, 60 * 3);
        return { hash };
    }
    async isVerificationCodeValid(hash, code) {
        const verifyHash = (await this.redisService.hgetall(`verify:${hash}`));
        common_1.Logger.log(verifyHash, 'verifyHash');
        if (!verifyHash)
            throw new apollo_1.ForbiddenError('EXPIRED');
        if (process.env.DEMO_MODE != null || verifyHash.code == code) {
            return verifyHash;
        }
        else {
            throw new apollo_1.ForbiddenError('INVALID');
        }
    }
    async deleteVerificationCode(hash) {
        await this.redisService.del(`verify:${hash}`);
    }
};
exports.AuthRedisService = AuthRedisService;
exports.AuthRedisService = AuthRedisService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_redis_1.InjectRedis)()),
    tslib_1.__metadata("design:paramtypes", [ioredis_1.default])
], AuthRedisService);
class VerifyHash {
}
exports.VerifyHash = VerifyHash;


/***/ }),
/* 241 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverResolver = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const database_1 = __webpack_require__(9);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_driver_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-driver.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const apollo_1 = __webpack_require__(5);
const typeorm_1 = __webpack_require__(11);
const jwt_auth_guard_1 = __webpack_require__(133);
const driver_service_1 = __webpack_require__(242);
const driver_location_dto_1 = __webpack_require__(243);
const driver_transaction_input_1 = __webpack_require__(244);
const driver_wallet_dto_1 = __webpack_require__(170);
const driver_dto_1 = __webpack_require__(165);
const feedback_parameter_aggregate_dto_1 = __webpack_require__(245);
const typeorm_2 = __webpack_require__(8);
let DriverResolver = class DriverResolver {
    constructor(driverService, sharedDriverService, operatorRepository, context) {
        this.driverService = driverService;
        this.sharedDriverService = sharedDriverService;
        this.operatorRepository = operatorRepository;
        this.context = context;
    }
    async getDriversLocation(center, count) {
        return this.driverService.getDriversLocation(center, count);
    }
    async getDriversLocationWithData(center, count) {
        return this.driverService.getDriversLocationWithData(center, count);
    }
    async createDriverTransaction(input) {
        input.amount =
            input.action == transaction_action_enum_1.TransactionAction.Recharge
                ? Math.abs(input.amount)
                : Math.abs(input.amount) * -1;
        return this.sharedDriverService.rechargeWallet({
            ...input,
            operatorId: this.context.req.user.id,
            status: transaction_status_enum_1.TransactionStatus.Done,
        });
    }
    async deleteOneDriver(id) {
        const operator = await this.operatorRepository.findOne({
            where: { id: this.context.req.user.id },
            relations: { role: true },
        });
        if (!operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Drivers_Edit)) {
            throw new apollo_1.ForbiddenError('PERMISSION_NOT_GRANTED');
        }
        return this.sharedDriverService.deleteById(id);
    }
    async driverFeedbackParametersSummary(driverId) {
        return this.driverService.driverFeedbackParametersSummary(driverId);
    }
};
exports.DriverResolver = DriverResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [driver_location_dto_1.OnlineDriver]),
    tslib_1.__param(0, (0, graphql_1.Args)('center', { type: () => database_1.Point })),
    tslib_1.__param(1, (0, graphql_1.Args)('count', { type: () => graphql_1.Int })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [database_1.Point, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DriverResolver.prototype, "getDriversLocation", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [driver_location_dto_1.OnlineDriverWithData]),
    tslib_1.__param(0, (0, graphql_1.Args)('center', { type: () => database_1.Point })),
    tslib_1.__param(1, (0, graphql_1.Args)('count', { type: () => graphql_1.Int })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [database_1.Point, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DriverResolver.prototype, "getDriversLocationWithData", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => driver_wallet_dto_1.DriverWalletDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => driver_transaction_input_1.DriverTransactionInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [driver_transaction_input_1.DriverTransactionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], DriverResolver.prototype, "createDriverTransaction", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => driver_dto_1.DriverDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DriverResolver.prototype, "deleteOneDriver", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [feedback_parameter_aggregate_dto_1.FeedbackParameterAggregateDto]),
    tslib_1.__param(0, (0, graphql_1.Args)('driverId', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DriverResolver.prototype, "driverFeedbackParametersSummary", null);
exports.DriverResolver = DriverResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(2, (0, typeorm_2.InjectRepository)(operator_entity_1.OperatorEntity)),
    tslib_1.__param(3, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [driver_service_1.DriverService, typeof (_a = typeof shared_driver_service_1.SharedDriverService !== "undefined" && shared_driver_service_1.SharedDriverService) === "function" ? _a : Object, typeorm_1.Repository, Object])
], DriverResolver);


/***/ }),
/* 242 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const driver_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_redis_service_1 = __webpack_require__(238);
const typeorm_2 = __webpack_require__(11);
let DriverService = class DriverService {
    constructor(driverRepository, driverRedisService) {
        this.driverRepository = driverRepository;
        this.driverRedisService = driverRedisService;
    }
    getDriversLocation(center, count) {
        return this.driverRedisService.getAllOnline(center, count);
    }
    async getDriversLocationWithData(center, count) {
        const drivers = await this.getDriversLocation(center, count);
        const driverData = await this.driverRepository.findByIds(drivers.map((driver) => driver.driverId));
        const result = driverData.map((_driver) => {
            const redisDriver = drivers.filter((driver) => driver.driverId == _driver.id)[0];
            const length = _driver.mobileNumber.toString().length;
            if (process.env.DEMO_MODE != null &&
                _driver.mobileNumber != null &&
                length > 4) {
                _driver.mobileNumber = `${_driver.mobileNumber
                    .toString()
                    .substring(0, length - 3)}xxxx`;
            }
            return {
                ..._driver,
                ...redisDriver,
            };
        });
        return result;
    }
    async driverFeedbackParametersSummary(driverId) {
        return this.driverRepository.query(`
        SELECT 
            review_parameter.title,
            ANY_VALUE(review_parameter.isGood) AS isGood,
            COUNT(review_parameter.id) AS count
        FROM
            review_parameter_feedbacks_request_review
        INNER JOIN review_parameter on review_parameter.id = review_parameter_feedbacks_request_review.reviewParameterId
        INNER JOIN request_review on request_review.id = review_parameter_feedbacks_request_review.requestReviewId
        WHERE
            request_review.driverId = ?
        GROUP BY
            review_parameter.title
        ORDER BY isGood DESC, count DESC`, [driverId]);
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.DriverEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        driver_redis_service_1.DriverRedisService])
], DriverService);


/***/ }),
/* 243 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OnlineDriverWithData = exports.OnlineDriver = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const eager_import_1 = __webpack_require__(96);
const eager_import_2 = __webpack_require__(27);
const graphql_1 = __webpack_require__(7);
let OnlineDriver = class OnlineDriver {
    static _GRAPHQL_METADATA_FACTORY() {
        return { location: { type: () => (__webpack_require__(72).Point) }, driverId: { type: () => Number }, lastUpdatedAt: { type: () => Number } };
    }
};
exports.OnlineDriver = OnlineDriver;
exports.OnlineDriver = OnlineDriver = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], OnlineDriver);
let OnlineDriverWithData = class OnlineDriverWithData {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, location: { type: () => (__webpack_require__(72).Point) }, lastUpdatedAt: { type: () => Number }, firstName: { nullable: true, type: () => String }, lastName: { nullable: true, type: () => String }, mobileNumber: { type: () => String }, status: { type: () => (__webpack_require__(96).DriverStatus) }, gender: { nullable: true, type: () => (__webpack_require__(27).Gender) }, rating: { nullable: true, type: () => Number }, reviewCount: { type: () => Number } };
    }
};
exports.OnlineDriverWithData = OnlineDriverWithData;
exports.OnlineDriverWithData = OnlineDriverWithData = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], OnlineDriverWithData);


/***/ }),
/* 244 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverTransactionInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/driver/dto/driver-transaction.input.ts
const graphql_1 = __webpack_require__(7); // Додано Float
// TODO: Перевірити/розширити ці Enum-и
const database_1 = __webpack_require__(9);
let DriverTransactionInput = class DriverTransactionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, description: { nullable: true, type: () => String } };
    }
};
exports.DriverTransactionInput = DriverTransactionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => database_1.TransactionAction, {}),
    tslib_1.__metadata("design:type", String)
], DriverTransactionInput.prototype, "action", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => database_1.DriverDeductTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", String)
], DriverTransactionInput.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => database_1.DriverRechargeTransactionType, { nullable: true }) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", String)
], DriverTransactionInput.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}) // Додано Float
    ,
    tslib_1.__metadata("design:type", Number)
], DriverTransactionInput.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], DriverTransactionInput.prototype, "driverId", void 0);
exports.DriverTransactionInput = DriverTransactionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], DriverTransactionInput);


/***/ }),
/* 245 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackParameterAggregateDto = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let FeedbackParameterAggregateDto = class FeedbackParameterAggregateDto {
    static _GRAPHQL_METADATA_FACTORY() {
        return { title: { type: () => String }, isGood: { type: () => Boolean } };
    }
};
exports.FeedbackParameterAggregateDto = FeedbackParameterAggregateDto;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], FeedbackParameterAggregateDto.prototype, "count", void 0);
exports.FeedbackParameterAggregateDto = FeedbackParameterAggregateDto = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('FeedbackParameterAggregate')
], FeedbackParameterAggregateDto);


/***/ }),
/* 246 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateDriverInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/driver/dto/driver.input.ts
const graphql_1 = __webpack_require__(7);
const driver_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/driver-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const gender_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/gender.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let UpdateDriverInput = class UpdateDriverInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.UpdateDriverInput = UpdateDriverInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], UpdateDriverInput.prototype, "fleetId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], UpdateDriverInput.prototype, "vehicleModelId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], UpdateDriverInput.prototype, "vehicleColorId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "vehiclePlate", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "certificateNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "email", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Object, { nullable: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof driver_status_enum_1.DriverStatus !== "undefined" && driver_status_enum_1.DriverStatus) === "function" ? _a : Object)
], UpdateDriverInput.prototype, "status", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Object, { nullable: true }),
    tslib_1.__metadata("design:type", typeof (_b = typeof gender_enum_1.Gender !== "undefined" && gender_enum_1.Gender) === "function" ? _b : Object)
], UpdateDriverInput.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "accountNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "bankName", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "bankRoutingNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "bankSwift", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "address", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateDriverInput.prototype, "softRejectionNote", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], UpdateDriverInput.prototype, "mediaId", void 0);
exports.UpdateDriverInput = UpdateDriverInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], UpdateDriverInput);


/***/ }),
/* 247 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackModule = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/feedback/feedback.module.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const feedback_parameter_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/feedback-parameter.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const feedback_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/feedback.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const feedback_parameter_dto_1 = __webpack_require__(167);
const feedback_dto_1 = __webpack_require__(166);
const feedback_parameter_input_1 = __webpack_require__(248);
const feedback_parameter_authorizer_1 = __webpack_require__(168); // Імпортуємо авторизатор
let FeedbackModule = class FeedbackModule {
};
exports.FeedbackModule = FeedbackModule;
exports.FeedbackModule = FeedbackModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        feedback_entity_1.FeedbackEntity,
                        feedback_parameter_entity_1.FeedbackParameterEntity,
                    ]),
                ],
                // Додаємо авторизатор як сервіс
                services: [feedback_parameter_authorizer_1.FeedbackParameterAuthorizer],
                resolvers: [
                    {
                        EntityClass: feedback_entity_1.FeedbackEntity,
                        DTOClass: feedback_dto_1.FeedbackDTO,
                        create: { disabled: true }, // Відгуки створюються клієнтами/водіями
                        update: { disabled: true },
                        delete: { disabled: true },
                        read: { one: { name: 'feedback' }, many: { name: 'feedbacks' } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: feedback_parameter_entity_1.FeedbackParameterEntity,
                        DTOClass: feedback_parameter_dto_1.FeedbackParameterDTO,
                        CreateDTOClass: feedback_parameter_input_1.FeedbackParameterInput,
                        UpdateDTOClass: feedback_parameter_input_1.FeedbackParameterInput,
                        // Застосовуємо авторизатор до CRUD операцій для параметрів
                        read: { one: { name: 'feedbackParameter' }, many: { name: 'feedbackParameters' }, authorizer: feedback_parameter_authorizer_1.FeedbackParameterAuthorizer },
                        create: { authorizer: feedback_parameter_authorizer_1.FeedbackParameterAuthorizer, many: { disabled: true } },
                        update: { authorizer: feedback_parameter_authorizer_1.FeedbackParameterAuthorizer, many: { disabled: true } },
                        delete: { authorizer: feedback_parameter_authorizer_1.FeedbackParameterAuthorizer, many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], FeedbackModule);


/***/ }),
/* 248 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackParameterInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/feedback/dto/feedback-parameter.input.ts
const graphql_1 = __webpack_require__(7); // Додано Field
let FeedbackParameterInput = class FeedbackParameterInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.FeedbackParameterInput = FeedbackParameterInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], FeedbackParameterInput.prototype, "title", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, {}),
    tslib_1.__metadata("design:type", Boolean)
], FeedbackParameterInput.prototype, "isGood", void 0);
exports.FeedbackParameterInput = FeedbackParameterInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], FeedbackParameterInput);


/***/ }),
/* 249 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetModule = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/fleet/fleet.module.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const fleet_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/fleet-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const fleet_wallet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/fleet-wallet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const fleet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/fleet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// TODO: Адаптувати або замінити SharedFleetService
const shared_fleet_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-fleet.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const fleet_transaction_dto_1 = __webpack_require__(174);
const fleet_wallet_dto_1 = __webpack_require__(250);
const fleet_dto_1 = __webpack_require__(251); // Імпортовано FleetType
const fleet_resolver_1 = __webpack_require__(254);
const fleet_input_1 = __webpack_require__(256);
const fleet_authorizer_1 = __webpack_require__(253); // Імпортовано авторизатор
let FleetModule = class FleetModule {
};
exports.FleetModule = FleetModule;
exports.FleetModule = FleetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        fleet_entity_1.FleetEntity,
                        fleet_transaction_entity_1.FleetTransactionEntity,
                        fleet_wallet_entity_1.FleetWalletEntity,
                    ]),
                ],
                // Додаємо авторизатор
                services: [fleet_authorizer_1.FleetAuthorizer],
                resolvers: [
                    {
                        EntityClass: fleet_entity_1.FleetEntity,
                        DTOClass: fleet_dto_1.FleetDTO,
                        CreateDTOClass: fleet_input_1.FleetInput,
                        UpdateDTOClass: fleet_input_1.FleetInput,
                        // Застосовуємо авторизатор до CRUD операцій
                        read: { one: { name: 'fleet' }, many: { name: 'fleets' }, authorizer: fleet_authorizer_1.FleetAuthorizer },
                        create: { authorizer: fleet_authorizer_1.FleetAuthorizer, many: { disabled: true } },
                        update: { authorizer: fleet_authorizer_1.FleetAuthorizer, many: { disabled: true } },
                        delete: { authorizer: fleet_authorizer_1.FleetAuthorizer, disabled: true }, // Видалення може бути кастомним
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: fleet_wallet_entity_1.FleetWalletEntity,
                        DTOClass: fleet_wallet_dto_1.FleetWalletDTO,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        read: { one: { name: 'fleetWallet' }, many: { name: 'fleetWallets' }, authorizer: fleet_authorizer_1.FleetAuthorizer }, // Додано авторизатор
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: fleet_transaction_entity_1.FleetTransactionEntity,
                        DTOClass: fleet_transaction_dto_1.FleetTransactionDTO,
                        // CreateDTOClass: FleetTransactionInput, // Використовуємо кастомну мутацію
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        read: { one: { name: 'fleetTransaction' }, many: { name: 'fleetTransactions' }, authorizer: fleet_authorizer_1.FleetAuthorizer }, // Додано авторизатор
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
        // Реєструємо резолвер та сервіс (який потрібно адаптувати)
        providers: [fleet_resolver_1.FleetResolver, shared_fleet_service_1.SharedFleetService], // TODO: Адаптувати SharedFleetService
    })
], FleetModule);


/***/ }),
/* 250 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetWalletDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/fleet/dto/fleet-wallet.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const fleet_dto_1 = __webpack_require__(251);
let FleetWalletDTO = class FleetWalletDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, balance: { type: () => Number }, currency: { type: () => String }, fleetId: { type: () => Number } };
    }
};
exports.FleetWalletDTO = FleetWalletDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FleetWalletDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.Float),
    tslib_1.__metadata("design:type", Number)
], FleetWalletDTO.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => String),
    tslib_1.__metadata("design:type", String)
], FleetWalletDTO.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FleetWalletDTO.prototype, "fleetId", void 0);
exports.FleetWalletDTO = FleetWalletDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('FleetWallet'),
    (0, nestjs_query_graphql_1.Relation)('fleet', () => fleet_dto_1.FleetDTO)
], FleetWalletDTO);


/***/ }),
/* 251 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetDTO = exports.FleetType = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
// admin-api/src/app/fleet/dto/fleet.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Float, Field, registerEnumType
const zone_price_dto_1 = __webpack_require__(252); // Можливо, зони будуть прив'язані до автопарків
const fleet_transaction_dto_1 = __webpack_require__(174);
const fleet_wallet_dto_1 = __webpack_require__(250);
const fleet_authorizer_1 = __webpack_require__(253);
const driver_dto_1 = __webpack_require__(165); // Для зв'язку з водіями
// Додаємо Enum для типу автопарку
var FleetType;
(function (FleetType) {
    FleetType["PASSENGER"] = "Passenger";
    FleetType["CARGO"] = "Cargo";
    FleetType["MIXED"] = "Mixed";
})(FleetType || (exports.FleetType = FleetType = {}));
(0, graphql_1.registerEnumType)(FleetType, { name: 'FleetType' });
let FleetDTO = class FleetDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, phoneNumber: { nullable: true, type: () => String }, mobileNumber: { type: () => String }, userName: { nullable: true, type: () => String }, accountNumber: { nullable: true, type: () => String }, address: { nullable: true, type: () => String }, exclusivityAreas: { nullable: true, type: () => [[(__webpack_require__(72).Point)]] } };
    }
};
exports.FleetDTO = FleetDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], FleetDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(),
    tslib_1.__metadata("design:type", String)
], FleetDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    tslib_1.__metadata("design:type", Number)
], FleetDTO.prototype, "commissionSharePercent", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    tslib_1.__metadata("design:type", Number)
], FleetDTO.prototype, "commissionShareFlat", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Загальний множник тарифу для цього автопарку' }),
    tslib_1.__metadata("design:type", Number)
], FleetDTO.prototype, "feeMultiplier", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => FleetType, { defaultValue: FleetType.CARGO, description: 'Тип автопарку' }),
    tslib_1.__metadata("design:type", String)
], FleetDTO.prototype, "type", void 0);
exports.FleetDTO = FleetDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Fleet'),
    (0, nestjs_query_graphql_1.UnPagedRelation)('wallet', () => fleet_wallet_dto_1.FleetWalletDTO, { relationName: 'wallet' }),
    (0, nestjs_query_graphql_1.OffsetConnection)('transactions', () => fleet_transaction_dto_1.FleetTransactionDTO),
    (0, nestjs_query_graphql_1.OffsetConnection)('zonePrices', () => zone_price_dto_1.ZonePriceDTO) // Ціни зон, специфічні для автопарку
    ,
    (0, nestjs_query_graphql_1.OffsetConnection)('drivers', () => driver_dto_1.DriverDTO) // Додаємо зв'язок з водіями цього автопарку
    ,
    (0, nestjs_query_graphql_1.Authorize)(fleet_authorizer_1.FleetAuthorizer)
], FleetDTO);


/***/ }),
/* 252 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZonePriceDTO = exports.ZonePriceCostType = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/service/dto/zone-price.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Float, registerEnumType, Field
const database_1 = __webpack_require__(9);
const fleet_dto_1 = __webpack_require__(251);
const service_authorizer_1 = __webpack_require__(156);
const service_dto_1 = __webpack_require__(151);
// Тип вартості для зони: фіксована, заміна тарифу за км, або відсоткова надбавка/знижка
var ZonePriceCostType;
(function (ZonePriceCostType) {
    ZonePriceCostType["FIXED"] = "Fixed";
    ZonePriceCostType["PER_KM_OVERRIDE"] = "PerKmOverride";
    ZonePriceCostType["SURCHARGE_PERCENT"] = "SurchargePercent";
    ZonePriceCostType["DISCOUNT_PERCENT"] = "DiscountPercent";
})(ZonePriceCostType || (exports.ZonePriceCostType = ZonePriceCostType = {}));
(0, graphql_1.registerEnumType)(ZonePriceCostType, { name: 'ZonePriceCostType' });
let ZonePriceDTO = class ZonePriceDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String } };
    }
};
exports.ZonePriceDTO = ZonePriceDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ZonePriceDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)() // Дозволяємо фільтрацію
    ,
    tslib_1.__metadata("design:type", String)
], ZonePriceDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [[database_1.Point]], { description: 'Полігони зони ВІДПРАВЛЕННЯ' }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceDTO.prototype, "from", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [[database_1.Point]], { description: 'Полігони зони ПРИЗНАЧЕННЯ' }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceDTO.prototype, "to", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Значення вартості (залежить від costType)' }),
    tslib_1.__metadata("design:type", Number)
], ZonePriceDTO.prototype, "cost", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => ZonePriceCostType, { description: 'Тип застосування вартості' }),
    tslib_1.__metadata("design:type", String)
], ZonePriceDTO.prototype, "costType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [database_1.TimeMultiplier], { description: 'Множники за часом доби для цього правила зони' }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceDTO.prototype, "timeMultipliers", void 0);
exports.ZonePriceDTO = ZonePriceDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ZonePrice'),
    (0, nestjs_query_graphql_1.UnPagedRelation)('fleets', () => fleet_dto_1.FleetDTO, {
        update: { enabled: true },
    }),
    (0, nestjs_query_graphql_1.UnPagedRelation)('services', () => service_dto_1.ServiceDTO, {
        update: { enabled: true },
    }),
    (0, nestjs_query_graphql_1.Authorize)(service_authorizer_1.ServiceAuthorizer)
], ZonePriceDTO);


/***/ }),
/* 253 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let FleetAuthorizer = class FleetAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({ where: { id: context.req.user.id }, relations: ['role'] });
        const viewPermission = operator_permission_enum_1.OperatorPermission.Fleets_View; // TODO: Перевірити/оновити права
        const editPermission = operator_permission_enum_1.OperatorPermission.Fleets_Edit; // TODO: Перевірити/оновити права
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(viewPermission)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(editPermission)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.FleetAuthorizer = FleetAuthorizer;
exports.FleetAuthorizer = FleetAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], FleetAuthorizer);


/***/ }),
/* 254 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetResolver = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/fleet/fleet.resolver.ts
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const transaction_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// TODO: Адаптувати SharedFleetService
const shared_fleet_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-fleet.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const fleet_transaction_input_1 = __webpack_require__(255);
const fleet_wallet_dto_1 = __webpack_require__(250);
const fleet_dto_1 = __webpack_require__(251); // Імпортуємо основний DTO
// Вказуємо основний DTO для резолвера
let FleetResolver = class FleetResolver {
    constructor(
    // TODO: Адаптувати або замінити SharedFleetService
    sharedFleetService, context) {
        this.sharedFleetService = sharedFleetService;
        this.context = context;
    }
    async createFleetTransaction(input) {
        input.amount = input.action == transaction_action_enum_1.TransactionAction.Recharge ? Math.abs(input.amount) : Math.abs(input.amount) * -1;
        // Потрібно переконатись, що sharedFleetService коректно працює з ID автопарку
        return this.sharedFleetService.rechargeWallet({ ...input, operatorId: this.context.req.user.id });
    }
};
exports.FleetResolver = FleetResolver;
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => fleet_wallet_dto_1.FleetWalletDTO) // Повертає оновлений гаманець
    ,
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => fleet_transaction_input_1.FleetTransactionInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [fleet_transaction_input_1.FleetTransactionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], FleetResolver.prototype, "createFleetTransaction", null);
exports.FleetResolver = FleetResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => fleet_dto_1.FleetDTO),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(1, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof shared_fleet_service_1.SharedFleetService !== "undefined" && shared_fleet_service_1.SharedFleetService) === "function" ? _a : Object, Object])
], FleetResolver);


/***/ }),
/* 255 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetTransactionInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/fleet/dto/fleet-transaction.input.ts
const graphql_1 = __webpack_require__(7); // Додано Float
// TODO: Переглянути ці Enum-и на релевантність для вантажних автопарків
const provider_deduct_transaction_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/provider-deduct-transaction-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const provider_recharge_transaction_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/provider-recharge-transaction-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let FleetTransactionInput = class FleetTransactionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, description: { nullable: true, type: () => String } };
    }
};
exports.FleetTransactionInput = FleetTransactionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => transaction_action_enum_1.TransactionAction, {}),
    tslib_1.__metadata("design:type", typeof (_a = typeof transaction_action_enum_1.TransactionAction !== "undefined" && transaction_action_enum_1.TransactionAction) === "function" ? _a : Object)
], FleetTransactionInput.prototype, "action", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType, { nullable: true }) // TODO: Переглянути Enum
    ,
    tslib_1.__metadata("design:type", typeof (_b = typeof provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType !== "undefined" && provider_deduct_transaction_type_enum_1.ProviderDeductTransactionType) === "function" ? _b : Object)
], FleetTransactionInput.prototype, "deductType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType, { nullable: true }) // TODO: Переглянути Enum
    ,
    tslib_1.__metadata("design:type", typeof (_c = typeof provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType !== "undefined" && provider_recharge_transaction_type_enum_1.ProviderRechargeTransactionType) === "function" ? _c : Object)
], FleetTransactionInput.prototype, "rechargeType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionInput.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], FleetTransactionInput.prototype, "fleetId", void 0);
exports.FleetTransactionInput = FleetTransactionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], FleetTransactionInput);


/***/ }),
/* 256 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FleetInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/fleet/dto/fleet.input.ts
const graphql_1 = __webpack_require__(7); // Додано Field, Float
const database_1 = __webpack_require__(9);
const fleet_dto_1 = __webpack_require__(251); // Імпортуємо Enum
let FleetInput = class FleetInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.FleetInput = FleetInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "phoneNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "mobileNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "userName", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "password", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "accountNumber", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    tslib_1.__metadata("design:type", Number)
], FleetInput.prototype, "commissionSharePercent", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    tslib_1.__metadata("design:type", Number)
], FleetInput.prototype, "commissionShareFlat", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], FleetInput.prototype, "feeMultiplier", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "address", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [[database_1.Point]], { nullable: true }),
    tslib_1.__metadata("design:type", Array)
], FleetInput.prototype, "exclusivityAreas", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => fleet_dto_1.FleetType, { defaultValue: fleet_dto_1.FleetType.CARGO, description: 'Тип автопарку' }),
    tslib_1.__metadata("design:type", String)
], FleetInput.prototype, "type", void 0);
exports.FleetInput = FleetInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], FleetInput);


/***/ }),
/* 257 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftCardModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const gift_batch_dto_1 = __webpack_require__(258);
const gift_code_dto_1 = __webpack_require__(259);
const gift_batch_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/gift-batch.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const gift_code_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/gift-code.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const gift_card_service_1 = __webpack_require__(262);
const gift_card_resolver_1 = __webpack_require__(263);
const typeorm_1 = __webpack_require__(8);
const operator_module_1 = __webpack_require__(201);
let GiftCardModule = class GiftCardModule {
};
exports.GiftCardModule = GiftCardModule;
exports.GiftCardModule = GiftCardModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            operator_module_1.OperatorModule,
            typeorm_1.TypeOrmModule.forFeature([gift_batch_entity_1.GiftBatchEntity, gift_code_entity_1.GiftCodeEntity]),
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([gift_batch_entity_1.GiftBatchEntity, gift_code_entity_1.GiftCodeEntity]),
                ],
                resolvers: [
                    {
                        EntityClass: gift_batch_entity_1.GiftBatchEntity,
                        DTOClass: gift_batch_dto_1.GiftBatchDTO,
                        update: { disabled: true },
                        delete: { disabled: true },
                        create: { disabled: true },
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                    },
                    {
                        EntityClass: gift_code_entity_1.GiftCodeEntity,
                        DTOClass: gift_code_dto_1.GiftCodeDTO,
                        update: { disabled: true },
                        delete: { disabled: true },
                        create: { disabled: true },
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                        read: { disabled: true },
                    },
                ],
            }),
        ],
        providers: [gift_card_service_1.GiftCardService, gift_card_resolver_1.GiftCardResolver],
    })
], GiftCardModule);


/***/ }),
/* 258 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftBatchDTO = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104);
const gift_code_dto_1 = __webpack_require__(259);
const gift_batch_authorizer_1 = __webpack_require__(261);
let GiftBatchDTO = class GiftBatchDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, currency: { type: () => String }, amount: { type: () => Number }, availableFrom: { nullable: true, type: () => Date }, expireAt: { nullable: true, type: () => Date } };
    }
};
exports.GiftBatchDTO = GiftBatchDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], GiftBatchDTO.prototype, "id", void 0);
exports.GiftBatchDTO = GiftBatchDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('GiftBatch'),
    (0, nestjs_query_graphql_1.OffsetConnection)('giftCodes', () => gift_code_dto_1.GiftCodeDTO, {
        enableTotalCount: true,
        enableAggregate: true,
    }),
    (0, nestjs_query_graphql_1.Authorize)(gift_batch_authorizer_1.GiftBatchAuthorizer)
], GiftBatchDTO);


/***/ }),
/* 259 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftCodeDTO = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104);
const rider_transaction_dto_1 = __webpack_require__(175);
const driver_transaction_dto_1 = __webpack_require__(158);
const gift_code_authorizer_1 = __webpack_require__(260);
let GiftCodeDTO = class GiftCodeDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, code: { type: () => String }, usedAt: { nullable: true, type: () => Date }, giftId: { type: () => Number } };
    }
};
exports.GiftCodeDTO = GiftCodeDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], GiftCodeDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], GiftCodeDTO.prototype, "usedAt", void 0);
exports.GiftCodeDTO = GiftCodeDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('GiftCode'),
    (0, nestjs_query_graphql_1.Relation)('riderTransaction', () => rider_transaction_dto_1.RiderTransactionDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.Relation)('driverTransaction', () => driver_transaction_dto_1.DriverTransactionDTO, { nullable: true }),
    (0, nestjs_query_graphql_1.Authorize)(gift_code_authorizer_1.GiftCodeAuthorizer)
], GiftCodeDTO);


/***/ }),
/* 260 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftCodeAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let GiftCodeAuthorizer = class GiftCodeAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: {
                role: true,
            },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.GiftBatch_ViewCodes)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.GiftCodeAuthorizer = GiftCodeAuthorizer;
exports.GiftCodeAuthorizer = GiftCodeAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], GiftCodeAuthorizer);


/***/ }),
/* 261 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftBatchAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let GiftBatchAuthorizer = class GiftBatchAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: {
                role: true,
            },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.GiftBatch_View)) {
            throw new common_1.UnauthorizedException();
        }
        return undefined;
    }
};
exports.GiftBatchAuthorizer = GiftBatchAuthorizer;
exports.GiftBatchAuthorizer = GiftBatchAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], GiftBatchAuthorizer);


/***/ }),
/* 262 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftCardService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const gift_code_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/gift-code.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const gift_batch_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/gift-batch.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const json_2_csv_1 = __webpack_require__(132);
const promises_1 = __webpack_require__(131);
const path_1 = __webpack_require__(127);
const operator_service_1 = __webpack_require__(203);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let GiftCardService = class GiftCardService {
    constructor(giftRepository, giftCodeRepository, operatorService) {
        this.giftRepository = giftRepository;
        this.giftCodeRepository = giftCodeRepository;
        this.operatorService = operatorService;
    }
    async createGiftCardBatch(input) {
        let gift = this.giftRepository.create({
            name: input.name,
            currency: input.currency,
            amount: input.amount,
            availableFrom: input.availableFrom,
            expireAt: input.expireAt,
            createdByOperatorId: input.operatorId,
        });
        gift = await this.giftRepository.save(gift);
        const giftCodes = Array.from(Array(input.quantity)).map(() => {
            return this.giftCodeRepository.create({
                code: this.generateGiftCode(),
                gift,
            });
        });
        await this.giftCodeRepository.save(giftCodes);
        return gift;
    }
    generateGiftCode() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    async exportGiftCardBatch(input) {
        const { batchId, operatorId } = input;
        await this.operatorService.hasPermission(operatorId, operator_permission_enum_1.OperatorPermission.GiftBatch_ViewCodes);
        const result = await this.giftCodeRepository.find({
            where: {
                giftId: batchId,
            },
            select: {
                code: true,
                usedAt: true,
            },
        });
        const str = await (0, json_2_csv_1.json2csv)(result);
        const fileName = `${new Date().getTime().toString()}.csv`;
        await (0, promises_1.writeFile)((0, path_1.join)(process.cwd(), 'uploads', `${new Date().getTime().toString()}.csv`), str);
        return {
            url: `uploads/${fileName}`,
        };
    }
};
exports.GiftCardService = GiftCardService;
exports.GiftCardService = GiftCardService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(gift_batch_entity_1.GiftBatchEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(gift_code_entity_1.GiftCodeEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        operator_service_1.OperatorService])
], GiftCardService);


/***/ }),
/* 263 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GiftCardResolver = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const gift_card_service_1 = __webpack_require__(262);
const gift_batch_dto_1 = __webpack_require__(258);
const create_gift_batch_input_1 = __webpack_require__(264);
const common_1 = __webpack_require__(2);
const jwt_auth_guard_1 = __webpack_require__(133);
let GiftCardResolver = class GiftCardResolver {
    constructor(giftCardService, context) {
        this.giftCardService = giftCardService;
        this.context = context;
    }
    async createGiftCardBatch(input) {
        return this.giftCardService.createGiftCardBatch({
            ...input,
            operatorId: this.context.req.user.id,
        });
    }
    async exportGiftCardBatch(batchId) {
        return (await this.giftCardService.exportGiftCardBatch({
            batchId,
            operatorId: this.context.req.user.id,
        })).url;
    }
};
exports.GiftCardResolver = GiftCardResolver;
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => gift_batch_dto_1.GiftBatchDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => create_gift_batch_input_1.CreateGiftBatchInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_gift_batch_input_1.CreateGiftBatchInput]),
    tslib_1.__metadata("design:returntype", Promise)
], GiftCardResolver.prototype, "createGiftCardBatch", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => String),
    tslib_1.__param(0, (0, graphql_1.Args)('batchId', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], GiftCardResolver.prototype, "exportGiftCardBatch", null);
exports.GiftCardResolver = GiftCardResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(1, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [gift_card_service_1.GiftCardService, Object])
], GiftCardResolver);


/***/ }),
/* 264 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateGiftBatchInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let CreateGiftBatchInput = class CreateGiftBatchInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { name: { type: () => String }, currency: { type: () => String }, amount: { type: () => Number }, availableFrom: { nullable: true, type: () => Date }, expireAt: { nullable: true, type: () => Date }, quantity: { type: () => Number } };
    }
};
exports.CreateGiftBatchInput = CreateGiftBatchInput;
exports.CreateGiftBatchInput = CreateGiftBatchInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreateGiftBatchInput);


/***/ }),
/* 265 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const database_1 = __webpack_require__(9);
const request_activity_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/request-activity.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const request_message_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/request-message.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const request_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/request.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_order_module_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-order.module'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const redis_helper_module_1 = __webpack_require__(237);
const jwt_auth_guard_1 = __webpack_require__(133);
const dispatcher_resolver_1 = __webpack_require__(266);
const order_message_dto_1 = __webpack_require__(179);
const order_dto_1 = __webpack_require__(147);
const order_subscription_service_1 = __webpack_require__(273);
const order_service_1 = __webpack_require__(272);
const order_cancel_reason_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/order-cancel-reason.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const order_cancel_reason_dto_1 = __webpack_require__(274);
const order_cancel_reason_input_1 = __webpack_require__(275);
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            shared_order_module_1.SharedOrderModule,
            redis_helper_module_1.RedisHelpersModule,
            typeorm_1.TypeOrmModule.forFeature([request_activity_entity_1.RequestActivityEntity]),
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        request_entity_1.RequestEntity,
                        request_message_entity_1.OrderMessageEntity,
                        order_cancel_reason_entity_1.OrderCancelReasonEntity,
                    ]),
                ],
                pubSub: database_1.RedisPubSubProvider.provider(),
                resolvers: [
                    {
                        EntityClass: request_entity_1.RequestEntity,
                        DTOClass: order_dto_1.OrderDTO,
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        enableAggregate: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                    },
                    {
                        EntityClass: request_message_entity_1.OrderMessageEntity,
                        DTOClass: order_message_dto_1.OrderMessageDTO,
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        read: { disabled: true },
                    },
                    {
                        EntityClass: order_cancel_reason_entity_1.OrderCancelReasonEntity,
                        DTOClass: order_cancel_reason_dto_1.OrderCancelReasonDTO,
                        CreateDTOClass: order_cancel_reason_input_1.OrderCancelReasonInput,
                        UpdateDTOClass: order_cancel_reason_input_1.OrderCancelReasonInput,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                    },
                ],
            }),
        ],
        providers: [
            dispatcher_resolver_1.DispatcherResolver,
            order_subscription_service_1.OrderSubscriptionService,
            order_service_1.OrderService,
            database_1.RedisPubSubProvider.provider(),
        ],
    })
], OrderModule);


/***/ }),
/* 266 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherResolver = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const shared_order_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-order.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const calculate_fare_dto_1 = __webpack_require__(267);
const calculate_fare_input_1 = __webpack_require__(270);
const create_order_input_1 = __webpack_require__(271);
const order_dto_1 = __webpack_require__(147);
const order_service_1 = __webpack_require__(272);
let DispatcherResolver = class DispatcherResolver {
    constructor(context, sharedOrderService, orderService) {
        this.context = context;
        this.sharedOrderService = sharedOrderService;
        this.orderService = orderService;
    }
    async calculateFare(input) {
        return this.sharedOrderService.calculateFare({ ...input, twoWay: false });
    }
    async createOrder(input) {
        return this.sharedOrderService.createOrder({
            ...input,
            operatorId: this.context.req.user.id,
            twoWay: false,
            optionIds: [],
            waitMinutes: 0,
        });
    }
    async cancelOrder(orderId) {
        return this.orderService.cancelOrder(orderId);
    }
    async assignDriverToOrder(orderId, driverId) {
        return this.sharedOrderService.assignOrderToDriver(orderId, driverId);
    }
};
exports.DispatcherResolver = DispatcherResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => calculate_fare_dto_1.CalculateFareDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => calculate_fare_input_1.CalculateFareInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [calculate_fare_input_1.CalculateFareInput]),
    tslib_1.__metadata("design:returntype", Promise)
], DispatcherResolver.prototype, "calculateFare", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => order_dto_1.OrderDTO),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => create_order_input_1.CreateOrderInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_order_input_1.CreateOrderInput]),
    tslib_1.__metadata("design:returntype", Promise)
], DispatcherResolver.prototype, "createOrder", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => order_dto_1.OrderDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('orderId', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DispatcherResolver.prototype, "cancelOrder", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => order_dto_1.OrderDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('orderId', { type: () => graphql_1.ID })),
    tslib_1.__param(1, (0, graphql_1.Args)('driverId', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], DispatcherResolver.prototype, "assignDriverToOrder", null);
exports.DispatcherResolver = DispatcherResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => order_dto_1.OrderDTO),
    tslib_1.__param(0, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_a = typeof shared_order_service_1.SharedOrderService !== "undefined" && shared_order_service_1.SharedOrderService) === "function" ? _a : Object, order_service_1.OrderService])
], DispatcherResolver);


/***/ }),
/* 267 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CalculateFareDTO = exports.CalculateFareError = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(268);
const eager_import_1 = __webpack_require__(267);
const graphql_1 = __webpack_require__(7);
var CalculateFareError;
(function (CalculateFareError) {
    CalculateFareError["RegionUnsupported"] = "REGION_UNSUPPORTED";
    CalculateFareError["NoServiceInRegion"] = "NO_SERVICE_IN_REGION";
})(CalculateFareError || (exports.CalculateFareError = CalculateFareError = {}));
(0, graphql_1.registerEnumType)(CalculateFareError, { name: 'CalculateFareError' });
let CalculateFareDTO = class CalculateFareDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { currency: { type: () => String }, distance: { type: () => Number }, duration: { type: () => Number }, services: { type: () => [(__webpack_require__(268).ServiceCategoryWithCostDTO)] }, error: { nullable: true, type: () => (__webpack_require__(267).CalculateFareError) } };
    }
};
exports.CalculateFareDTO = CalculateFareDTO;
exports.CalculateFareDTO = CalculateFareDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], CalculateFareDTO);


/***/ }),
/* 268 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceCategoryWithCostDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(269);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let ServiceCategoryWithCostDTO = class ServiceCategoryWithCostDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, services: { type: () => [(__webpack_require__(269).ServiceWithCostDTO)] } };
    }
};
exports.ServiceCategoryWithCostDTO = ServiceCategoryWithCostDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ServiceCategoryWithCostDTO.prototype, "id", void 0);
exports.ServiceCategoryWithCostDTO = ServiceCategoryWithCostDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ServiceCategoryWithCost')
], ServiceCategoryWithCostDTO);


/***/ }),
/* 269 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceWithCostDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(154);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let ServiceWithCostDTO = class ServiceWithCostDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, cost: { type: () => Number }, media: { type: () => (__webpack_require__(154).MediaDTO) } };
    }
};
exports.ServiceWithCostDTO = ServiceWithCostDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ServiceWithCostDTO.prototype, "id", void 0);
exports.ServiceWithCostDTO = ServiceWithCostDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ServiceWithCost')
], ServiceWithCostDTO);


/***/ }),
/* 270 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CalculateFareInput = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const graphql_1 = __webpack_require__(7);
let CalculateFareInput = class CalculateFareInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { points: { type: () => [(__webpack_require__(72).Point)] } };
    }
};
exports.CalculateFareInput = CalculateFareInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], CalculateFareInput.prototype, "riderId", void 0);
exports.CalculateFareInput = CalculateFareInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CalculateFareInput);


/***/ }),
/* 271 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateOrderInput = exports.SelectedOrderOptionInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/order/dto/create-order.input.ts
const graphql_1 = __webpack_require__(7); // Додано Float
const database_1 = __webpack_require__(9);
// Допоміжний тип для передачі обраних опцій
let SelectedOrderOptionInput = class SelectedOrderOptionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.SelectedOrderOptionInput = SelectedOrderOptionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], SelectedOrderOptionInput.prototype, "optionId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Кількість (напр., вантажників)' }),
    tslib_1.__metadata("design:type", Number)
], SelectedOrderOptionInput.prototype, "quantity", void 0);
exports.SelectedOrderOptionInput = SelectedOrderOptionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)('SelectedOrderOptionInput')
], SelectedOrderOptionInput);
let CreateOrderInput = class CreateOrderInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.CreateOrderInput = CreateOrderInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "riderId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "serviceId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [database_1.Point], {}),
    tslib_1.__metadata("design:type", Array)
], CreateOrderInput.prototype, "points", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [String], {}),
    tslib_1.__metadata("design:type", Array)
], CreateOrderInput.prototype, "addresses", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { description: 'Час, на який потрібно подати авто (хвилини від поточного, 0 - зараз)' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "intervalMinutes", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, description: 'Опис вантажу' }),
    tslib_1.__metadata("design:type", String)
], CreateOrderInput.prototype, "cargoDescription", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Орієнтовна вага вантажу (кг)' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "cargoWeightKg", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Орієнтовний об\'єм вантажу (м³)' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "cargoVolumeM3", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Поверх в точці завантаження' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "pickupFloors", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Поверх в точці розвантаження' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "dropoffFloors", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [SelectedOrderOptionInput], { nullable: true, description: 'Обрані додаткові опції' }),
    tslib_1.__metadata("design:type", Array)
], CreateOrderInput.prototype, "selectedOptionsInput", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Орієнтовний час роботи в точці завантаження (хвилини)' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "estimatedPickupWorkTimeMinutes", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Орієнтовний час роботи в точці розвантаження (хвилини)' }),
    tslib_1.__metadata("design:type", Number)
], CreateOrderInput.prototype, "estimatedDropoffWorkTimeMinutes", void 0);
exports.CreateOrderInput = CreateOrderInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreateOrderInput);


/***/ }),
/* 272 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const order_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/order-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const request_activity_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/request-activity-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const request_activity_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/request-activity.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const request_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/request.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const order_redis_service_1 = __webpack_require__(239);
const graphql_redis_subscriptions_1 = __webpack_require__(105);
const typeorm_2 = __webpack_require__(11);
let OrderService = class OrderService {
    constructor(orderRepository, activityRepository, orderRedisService, pubSub) {
        this.orderRepository = orderRepository;
        this.activityRepository = activityRepository;
        this.orderRedisService = orderRedisService;
        this.pubSub = pubSub;
    }
    async cancelOrder(orderId) {
        let order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: { service: true },
        });
        this.activityRepository.insert({
            requestId: order.id,
            type: request_activity_type_enum_1.RequestActivityType.CanceledByOperator,
        });
        await this.orderRepository.update(order.id, {
            status: order_status_enum_1.OrderStatus.Expired,
            finishTimestamp: new Date(),
            costAfterCoupon: 0,
        });
        this.orderRedisService.expire([order.id]);
        this.pubSub.publish('orderRemoved', { orderRemoved: order });
        return order;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(request_entity_1.RequestEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(request_activity_entity_1.RequestActivityEntity)),
    tslib_1.__param(3, (0, nestjs_query_graphql_1.InjectPubSub)()),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        order_redis_service_1.OrderRedisService,
        graphql_redis_subscriptions_1.RedisPubSub])
], OrderService);


/***/ }),
/* 273 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderSubscriptionService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const graphql_redis_subscriptions_1 = __webpack_require__(105);
const order_dto_1 = __webpack_require__(147);
let OrderSubscriptionService = class OrderSubscriptionService {
    constructor(pubSub) {
        this.pubSub = pubSub;
    }
    orderUpdated(orderId) {
        return this.pubSub.asyncIterator('orderUpdated');
    }
};
exports.OrderSubscriptionService = OrderSubscriptionService;
tslib_1.__decorate([
    (0, graphql_1.Subscription)(() => order_dto_1.OrderDTO, {
        filter: (payload, variables, context) => {
            return variables.orderId == payload.orderUpdated.id;
        },
    }),
    tslib_1.__param(0, (0, graphql_1.Args)('orderId', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], OrderSubscriptionService.prototype, "orderUpdated", null);
exports.OrderSubscriptionService = OrderSubscriptionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_query_graphql_1.InjectPubSub)()),
    tslib_1.__metadata("design:paramtypes", [graphql_redis_subscriptions_1.RedisPubSub])
], OrderSubscriptionService);


/***/ }),
/* 274 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderCancelReasonDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const anouncement_user_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/anouncement-user-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const service_authorizer_1 = __webpack_require__(156);
let OrderCancelReasonDTO = class OrderCancelReasonDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number } };
    }
};
exports.OrderCancelReasonDTO = OrderCancelReasonDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], OrderCancelReasonDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], OrderCancelReasonDTO.prototype, "title", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, {}),
    tslib_1.__metadata("design:type", Boolean)
], OrderCancelReasonDTO.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => anouncement_user_type_enum_1.AnnouncementUserType, {}),
    tslib_1.__metadata("design:type", typeof (_a = typeof anouncement_user_type_enum_1.AnnouncementUserType !== "undefined" && anouncement_user_type_enum_1.AnnouncementUserType) === "function" ? _a : Object)
], OrderCancelReasonDTO.prototype, "userType", void 0);
exports.OrderCancelReasonDTO = OrderCancelReasonDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('OrderCancelReason'),
    (0, nestjs_query_graphql_1.Authorize)(service_authorizer_1.ServiceAuthorizer)
], OrderCancelReasonDTO);


/***/ }),
/* 275 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderCancelReasonInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const anouncement_user_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/anouncement-user-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let OrderCancelReasonInput = class OrderCancelReasonInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { title: { nullable: true, type: () => String } };
    }
};
exports.OrderCancelReasonInput = OrderCancelReasonInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrderCancelReasonInput.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => anouncement_user_type_enum_1.AnnouncementUserType, { nullable: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof anouncement_user_type_enum_1.AnnouncementUserType !== "undefined" && anouncement_user_type_enum_1.AnnouncementUserType) === "function" ? _a : Object)
], OrderCancelReasonInput.prototype, "userType", void 0);
exports.OrderCancelReasonInput = OrderCancelReasonInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], OrderCancelReasonInput);


/***/ }),
/* 276 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentGatewayModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const payment_gateway_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/payment-gateway.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const payment_gateway_dto_1 = __webpack_require__(163);
const payment_gateway_input_1 = __webpack_require__(277);
let PaymentGatewayModule = class PaymentGatewayModule {
};
exports.PaymentGatewayModule = PaymentGatewayModule;
exports.PaymentGatewayModule = PaymentGatewayModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([payment_gateway_entity_1.PaymentGatewayEntity])],
                resolvers: [
                    {
                        EntityClass: payment_gateway_entity_1.PaymentGatewayEntity,
                        DTOClass: payment_gateway_dto_1.PaymentGatewayDTO,
                        CreateDTOClass: payment_gateway_input_1.PaymentGatewayInput,
                        UpdateDTOClass: payment_gateway_input_1.PaymentGatewayInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], PaymentGatewayModule);


/***/ }),
/* 277 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentGatewayInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let PaymentGatewayInput = class PaymentGatewayInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { enabled: { type: () => Boolean }, title: { type: () => String }, type: { type: () => Object }, publicKey: { nullable: true, type: () => String }, privateKey: { type: () => String }, merchantId: { nullable: true, type: () => String }, saltKey: { nullable: true, type: () => String }, mediaId: { nullable: true, type: () => Number } };
    }
};
exports.PaymentGatewayInput = PaymentGatewayInput;
exports.PaymentGatewayInput = PaymentGatewayInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], PaymentGatewayInput);


/***/ }),
/* 278 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const payout_method_dto_1 = __webpack_require__(160);
const payout_method_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/payout-method.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const create_payout_method_input_1 = __webpack_require__(279);
const jwt_auth_guard_1 = __webpack_require__(133);
const payout_account_dto_1 = __webpack_require__(159);
const payout_account_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/payout-account.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const payout_session_dto_1 = __webpack_require__(280);
const payout_session_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/payout-session.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const payout_service_1 = __webpack_require__(281);
const payout_resolver_1 = __webpack_require__(282);
const typeorm_1 = __webpack_require__(8);
const region_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/region.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_wallet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-wallet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_module_1 = __webpack_require__(201);
let PayoutModule = class PayoutModule {
};
exports.PayoutModule = PayoutModule;
exports.PayoutModule = PayoutModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            operator_module_1.OperatorModule,
            typeorm_1.TypeOrmModule.forFeature([
                region_entity_1.RegionEntity,
                payout_session_entity_1.PayoutSessionEntity,
                driver_wallet_entity_1.DriverWalletEntity,
                driver_transaction_entity_1.DriverTransactionEntity,
            ]),
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        payout_method_entity_1.PayoutMethodEntity,
                        payout_session_entity_1.PayoutSessionEntity,
                        payout_account_entity_1.PayoutAccountEntity,
                    ]),
                ],
                resolvers: [
                    {
                        DTOClass: payout_method_dto_1.PayoutMethodDTO,
                        EntityClass: payout_method_entity_1.PayoutMethodEntity,
                        CreateDTOClass: create_payout_method_input_1.CreatePayoutMethodInput,
                        UpdateDTOClass: create_payout_method_input_1.CreatePayoutMethodInput,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        enableTotalCount: true,
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                    },
                    {
                        DTOClass: payout_account_dto_1.PayoutAccountDTO,
                        EntityClass: payout_account_entity_1.PayoutAccountEntity,
                        read: { many: { disabled: true } },
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        DTOClass: payout_session_dto_1.PayoutSessionDTO,
                        EntityClass: payout_session_entity_1.PayoutSessionEntity,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                    },
                ],
            }),
        ],
        providers: [payout_service_1.PayoutService, payout_resolver_1.PayoutResolver],
    })
], PayoutModule);


/***/ }),
/* 279 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePayoutMethodInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/payout/dto/create-payout-method.input.ts
const graphql_1 = __webpack_require__(7); // Додано Field, ID
// TODO: Перевірити/розширити цей Enum
const payout_method_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/payout-method-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let CreatePayoutMethodInput = class CreatePayoutMethodInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.CreatePayoutMethodInput = CreatePayoutMethodInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true, defaultValue: true }) // За замовчуванням активний
    ,
    tslib_1.__metadata("design:type", Boolean)
], CreatePayoutMethodInput.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], CreatePayoutMethodInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], CreatePayoutMethodInput.prototype, "description", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], CreatePayoutMethodInput.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => payout_method_type_enum_1.PayoutMethodType, {}) // TODO: Перевірити/розширити Enum
    ,
    tslib_1.__metadata("design:type", typeof (_a = typeof payout_method_type_enum_1.PayoutMethodType !== "undefined" && payout_method_type_enum_1.PayoutMethodType) === "function" ? _a : Object)
], CreatePayoutMethodInput.prototype, "type", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], CreatePayoutMethodInput.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], CreatePayoutMethodInput.prototype, "privateKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], CreatePayoutMethodInput.prototype, "saltKey", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    tslib_1.__metadata("design:type", String)
], CreatePayoutMethodInput.prototype, "merchantId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], CreatePayoutMethodInput.prototype, "mediaId", void 0);
exports.CreatePayoutMethodInput = CreatePayoutMethodInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreatePayoutMethodInput);


/***/ }),
/* 280 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutSessionDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/payout/dto/payout-session.dto.ts
const graphql_1 = __webpack_require__(7); // Додано Field, Float
const nestjs_query_graphql_1 = __webpack_require__(104);
const payout_session_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/payout-session-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_transaction_dto_1 = __webpack_require__(158);
const payout_method_dto_1 = __webpack_require__(160);
const payout_authorizer_1 = __webpack_require__(162);
const operator_dto_1 = __webpack_require__(144); // Для зв'язку з оператором
let PayoutSessionDTO = class PayoutSessionDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, createdAt: { type: () => Date }, description: { nullable: true, type: () => String }, status: { type: () => Object }, currency: { type: () => String }, createdByOperatorId: { nullable: true, type: () => Number } };
    }
};
exports.PayoutSessionDTO = PayoutSessionDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], PayoutSessionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)({ description: 'Дата створення сесії' }) // Додано фільтрацію
    ,
    tslib_1.__metadata("design:type", Date)
], PayoutSessionDTO.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true, description: 'Дата обробки/завершення сесії' }),
    tslib_1.__metadata("design:type", Date)
], PayoutSessionDTO.prototype, "processedAt", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => payout_session_status_enum_1.PayoutSessionStatus, { description: 'Статус сесії виплат' }) // Додано фільтрацію
    ,
    tslib_1.__metadata("design:type", typeof (_a = typeof payout_session_status_enum_1.PayoutSessionStatus !== "undefined" && payout_session_status_enum_1.PayoutSessionStatus) === "function" ? _a : Object)
], PayoutSessionDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Загальна сума виплат у цій сесії' }),
    tslib_1.__metadata("design:type", Number)
], PayoutSessionDTO.prototype, "totalAmount", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PayoutSessionDTO.prototype, "createdByOperatorId", void 0);
exports.PayoutSessionDTO = PayoutSessionDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('PayoutSession')
    // Зв'язок з транзакціями водіїв, що входять до цієї сесії
    ,
    (0, nestjs_query_graphql_1.OffsetConnection)('driverTransactions', () => driver_transaction_dto_1.DriverTransactionDTO, {
        enableAggregate: true, // Дозволяє агрегацію (наприклад, суму)
    })
    // Зв'язок з методами виплат, що використовуються в цій сесії
    ,
    (0, nestjs_query_graphql_1.UnPagedRelation)('payoutMethods', () => payout_method_dto_1.PayoutMethodDTO),
    Relation('operator', () => operator_dto_1.OperatorDTO, { nullable: true, description: 'Оператор, що створив сесію' }) // Додано зв'язок з оператором
    ,
    (0, nestjs_query_graphql_1.Authorize)(payout_authorizer_1.PayoutAuthorizer) // Застосовуємо авторизатор
], PayoutSessionDTO);


/***/ }),
/* 281 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const region_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/region.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const driver_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_wallet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver-wallet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const payout_session_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/payout-session-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const payout_session_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/payout-session.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const driver_deduct_transaction_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/driver-deduct-transaction-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const apollo_1 = __webpack_require__(5);
const json_2_csv_1 = __webpack_require__(132);
const promises_1 = __webpack_require__(131);
const path_1 = __webpack_require__(127);
const transaction_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const payout_method_type_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/payout-method-type.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const stripe_1 = __webpack_require__(161);
const payout_method_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/payout-method.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let PayoutService = class PayoutService {
    constructor(regionRepository, payoutSessionRepository, payoutMethodRepository, driverWalletRepository, driverTransactionRepository) {
        this.regionRepository = regionRepository;
        this.payoutSessionRepository = payoutSessionRepository;
        this.payoutMethodRepository = payoutMethodRepository;
        this.driverWalletRepository = driverWalletRepository;
        this.driverTransactionRepository = driverTransactionRepository;
    }
    async getSupportedCurrencies() {
        const regions = await this.regionRepository.find();
        const currencies = regions.map((region) => region.currency);
        const distinctCurrencies = [...new Set(currencies)];
        return distinctCurrencies;
    }
    async getPayoutStatistics(input) {
        let { currency } = input;
        if (!currency) {
            const currentCurrencies = await this.getSupportedCurrencies();
            currency = currentCurrencies.length > 0 ? currentCurrencies[0] : 'USD';
        }
        const pendingAmount = await this.getPendingAmount(currency);
        const lastPayoutAmount = await this.getLastPayoutAmount(currency);
        const payoutMethodStats = await this.getDriversDefaultPayoutMethodStats(currency);
        return {
            pendingAmount,
            lastPayoutAmount,
            currency,
            usersDefaultPayoutMethodStats: payoutMethodStats,
        };
    }
    async getPendingAmount(currency) {
        const pendingAmount = await this.driverWalletRepository.find({
            where: { currency, balance: (0, typeorm_2.MoreThan)(0) },
        });
        const sum = pendingAmount.reduce((a, b) => a + (b.balance || 0), 0);
        return sum || 0;
    }
    async getDriversDefaultPayoutMethodStats(currency) {
        const driverWallets = await this.driverWalletRepository.find({
            where: { currency },
            relations: ['driver', 'driver.payoutAccounts'],
        });
        const payoutMethods = await this.payoutMethodRepository.find({
            where: { currency },
        });
        const result = [];
        payoutMethods.forEach((payoutMethod) => {
            const driverWalletsWithPayoutMethod = driverWallets.filter((driverWallet) => {
                if (driverWallet.driver == null) {
                    // This drivers have deleted their account
                    return false;
                }
                return driverWallet.driver.payoutAccounts.find((account) => account.payoutMethodId === payoutMethod.id && account.isDefault);
            });
            if (driverWalletsWithPayoutMethod.length > 0) {
                result.push({
                    payoutMethod,
                    totalCount: driverWalletsWithPayoutMethod.length,
                });
            }
        });
        const driversWithoutDefaultPayoutMethod = driverWallets.filter((driverWallet) => {
            if (driverWallet.driver == null) {
                // This drivers have deleted their account
                return false;
            }
            return (driverWallet.driver.payoutAccounts.filter((account) => account.isDefault).length === 0);
        });
        if (driversWithoutDefaultPayoutMethod.length > 0) {
            result.push({
                payoutMethod: null,
                totalCount: driversWithoutDefaultPayoutMethod.length,
            });
        }
        return result;
    }
    async getLastPayoutAmount(currency) {
        const lastPayout = await this.payoutSessionRepository.findOne({
            where: {
                currency,
                status: payout_session_status_enum_1.PayoutSessionStatus.PAID,
            },
            order: {
                createdAt: 'DESC',
            },
        });
        if (!lastPayout) {
            return 0;
        }
        return lastPayout.totalAmount;
    }
    async createPayoutSession(operatorId, input) {
        try {
            const driverWallets = await this.driverWalletRepository.find({
                where: {
                    currency: input.currency,
                    balance: (0, typeorm_2.MoreThanOrEqual)(input.minimumAmount),
                },
                relations: ['driver', 'driver.payoutAccounts'],
            });
            if (driverWallets.length === 0) {
                throw new apollo_1.ForbiddenError('No drivers to payout with these filters');
            }
            const session = this.payoutSessionRepository.create({
                createdByOperatorId: operatorId,
                currency: input.currency,
                description: input.description,
                totalAmount: 0,
                payoutMethods: input.payoutMethodIds.map((id) => ({ id })),
            });
            const result = await this.payoutSessionRepository.save(session);
            let totalAmount = 0;
            for (const driverWallet of driverWallets) {
                if (driverWallet.driver?.payoutAccounts == null ||
                    driverWallet.driver.payoutAccounts.length === 0) {
                    continue;
                }
                const defaultPayoutAccount = driverWallet.driver.payoutAccounts.find((account) => account.isDefault);
                if (defaultPayoutAccount) {
                    totalAmount += driverWallet.balance;
                    const transaction = this.driverTransactionRepository.create({
                        driverId: driverWallet.driver.id,
                        amount: driverWallet.balance,
                        currency: driverWallet.currency,
                        action: transaction_action_enum_1.TransactionAction.Deduct,
                        deductType: driver_deduct_transaction_type_enum_1.DriverDeductTransactionType.Withdraw,
                        payoutSessionId: result.id,
                        payoutAccountId: defaultPayoutAccount.id,
                        payoutMethodId: defaultPayoutAccount.payoutMethodId,
                    });
                    await this.driverTransactionRepository.save(transaction);
                }
            }
            await this.payoutSessionRepository.update(result.id, { totalAmount });
            return result;
        }
        catch (error) {
            console.log(error);
            throw new apollo_1.ForbiddenError(JSON.stringify(error));
        }
    }
    async exportToCsv(input) {
        const driverTransactions = await this.driverTransactionRepository.find({
            where: {
                payoutSessionId: input.payoutSessionId,
                payoutMethodId: input.payoutMethodId,
                status: transaction_status_enum_1.TransactionStatus.Processing,
            },
            relations: ['driver', 'payoutAccount', 'payoutMethod'],
        });
        const result = driverTransactions.map((transaction) => {
            return {
                transactionId: transaction.id,
                driverFirstName: transaction.driver.firstName,
                driverLastName: transaction.driver.lastName,
                amount: transaction.amount,
                currency: transaction.currency,
                accountNumber: transaction.payoutAccount.accountNumber,
                routingNumber: transaction.payoutAccount.routingNumber,
                bankName: transaction.payoutAccount.bankName,
                branchName: transaction.payoutAccount.branchName,
                accountHolderName: transaction.payoutAccount.accountHolderName,
                accountHolderCountry: transaction.payoutAccount.accountHolderCountry,
                accountHolderState: transaction.payoutAccount.accountHolderState,
                accountHolderCity: transaction.payoutAccount.accountHolderCity,
                accountHolderAddress: transaction.payoutAccount.accountHolderAddress,
                accountHolderZip: transaction.payoutAccount.accountHolderZip,
            };
        });
        const str = await (0, json_2_csv_1.json2csv)(result);
        const fileName = `${new Date().getTime().toString()}.csv`;
        await (0, promises_1.writeFile)((0, path_1.join)(process.cwd(), 'uploads', `${new Date().getTime().toString()}.csv`), str);
        return {
            url: `uploads/${fileName}`,
        };
    }
    async runAutoPayout(input) {
        const driverTransactions = await this.driverTransactionRepository.find({
            where: {
                payoutSessionId: input.payoutSessionId,
                payoutMethodId: input.payoutMethodId,
                status: transaction_status_enum_1.TransactionStatus.Processing,
            },
            relations: ['driver', 'payoutAccount', 'payoutMethod'],
        });
        for (const transaction of driverTransactions) {
            if (transaction.payoutMethod.type == payout_method_type_enum_1.PayoutMethodType.Stripe) {
                const instance = new stripe_1.Stripe(transaction.payoutMethod.privateKey, {
                    apiVersion: '2022-11-15',
                });
                await instance.transfers.create({
                    amount: Math.floor(transaction.amount * 100),
                    currency: transaction.currency,
                    destination: transaction.payoutAccount.token,
                    description: 'Payout',
                });
                this.driverWalletRepository.decrement({
                    driverId: transaction.driverId,
                    currency: transaction.currency,
                }, 'balance', transaction.amount);
                await this.driverTransactionRepository.update(transaction.id, {
                    status: transaction_status_enum_1.TransactionStatus.Done,
                });
            }
        }
    }
    async manualPayout(input) {
        const driverTransaction = await this.driverTransactionRepository.findOneBy({
            id: input.driverTransactionId,
        });
        this.driverTransactionRepository.update(input.driverTransactionId, {
            refrenceNumber: input.transactionNumber,
            description: input.description,
            status: transaction_status_enum_1.TransactionStatus.Done,
        });
        this.driverWalletRepository.decrement({
            driverId: driverTransaction.driverId,
            currency: driverTransaction.currency,
        }, 'balance', driverTransaction.amount);
        return this.driverTransactionRepository.findOneBy({
            id: input.driverTransactionId,
        });
    }
    async updatePayoutSession(id, update) {
        await this.payoutSessionRepository.update(id, update);
        return this.payoutSessionRepository.findOneBy({ id });
    }
};
exports.PayoutService = PayoutService;
exports.PayoutService = PayoutService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(region_entity_1.RegionEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(payout_session_entity_1.PayoutSessionEntity)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(payout_method_entity_1.PayoutMethodEntity)),
    tslib_1.__param(3, (0, typeorm_1.InjectRepository)(driver_wallet_entity_1.DriverWalletEntity)),
    tslib_1.__param(4, (0, typeorm_1.InjectRepository)(driver_transaction_entity_1.DriverTransactionEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PayoutService);
class ExportCSV {
}


/***/ }),
/* 282 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutResolver = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const payout_service_1 = __webpack_require__(281);
const payout_statistics_dto_1 = __webpack_require__(283);
const payout_session_dto_1 = __webpack_require__(280);
const create_payout_session_input_1 = __webpack_require__(284);
const common_1 = __webpack_require__(2);
const jwt_auth_guard_1 = __webpack_require__(133);
const export_session_to_csv_input_1 = __webpack_require__(285);
const run_auto_payout_input_1 = __webpack_require__(286);
const driver_transaction_dto_1 = __webpack_require__(158);
const manual_payout_input_1 = __webpack_require__(287);
const operator_service_1 = __webpack_require__(203);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const apollo_1 = __webpack_require__(5);
const update_payout_session_input_1 = __webpack_require__(288);
let PayoutResolver = class PayoutResolver {
    constructor(payoutService, operatorService, context) {
        this.payoutService = payoutService;
        this.operatorService = operatorService;
        this.context = context;
    }
    async supportedCurrencies() {
        return this.payoutService.getSupportedCurrencies();
    }
    async payoutStatistics(currency) {
        return this.payoutService.getPayoutStatistics({ currency });
    }
    async createPayoutSession(input) {
        const hasPermission = await this.operatorService.hasPermissionBoolean(this.context.req.user.id, operator_permission_enum_1.OperatorPermission.Payouts_Edit);
        if (!hasPermission) {
            throw new apollo_1.ForbiddenError('You do not have permission to perform this action');
        }
        return this.payoutService.createPayoutSession(this.context.req.user.id, input);
    }
    async exportSessionToCsv(input) {
        const hasPermission = await this.operatorService.hasPermissionBoolean(this.context.req.user.id, operator_permission_enum_1.OperatorPermission.Payouts_Edit);
        if (!hasPermission) {
            throw new apollo_1.ForbiddenError('You do not have permission to perform this action');
        }
        const csv = await this.payoutService.exportToCsv(input);
        return csv.url;
    }
    async runAutoPayout(input) {
        const hasPermission = await this.operatorService.hasPermissionBoolean(this.context.req.user.id, operator_permission_enum_1.OperatorPermission.Payouts_Edit);
        if (!hasPermission) {
            throw new apollo_1.ForbiddenError('You do not have permission to perform this action');
        }
        await this.payoutService.runAutoPayout(input);
        return true;
    }
    async manualPayout(input) {
        const hasPermission = await this.operatorService.hasPermissionBoolean(this.context.req.user.id, operator_permission_enum_1.OperatorPermission.Payouts_Edit);
        if (!hasPermission) {
            throw new apollo_1.ForbiddenError('You do not have permission to perform this action');
        }
        return this.payoutService.manualPayout(input);
    }
    async updatePayoutSession(id, input) {
        const hasPermission = await this.operatorService.hasPermissionBoolean(this.context.req.user.id, operator_permission_enum_1.OperatorPermission.Payouts_Edit);
        if (!hasPermission) {
            throw new apollo_1.ForbiddenError('You do not have permission to perform this action');
        }
        return this.payoutService.updatePayoutSession(id, input);
    }
};
exports.PayoutResolver = PayoutResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [String]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PayoutResolver.prototype, "supportedCurrencies", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => payout_statistics_dto_1.PayoutStatisticsDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('currency', { type: () => String, nullable: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayoutResolver.prototype, "payoutStatistics", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => payout_session_dto_1.PayoutSessionDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => create_payout_session_input_1.CreatePayoutSessionInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_payout_session_input_1.CreatePayoutSessionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], PayoutResolver.prototype, "createPayoutSession", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => String),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => export_session_to_csv_input_1.ExportSessionToCsvInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [export_session_to_csv_input_1.ExportSessionToCsvInput]),
    tslib_1.__metadata("design:returntype", Promise)
], PayoutResolver.prototype, "exportSessionToCsv", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => run_auto_payout_input_1.RunAutoPayoutInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [run_auto_payout_input_1.RunAutoPayoutInput]),
    tslib_1.__metadata("design:returntype", Promise)
], PayoutResolver.prototype, "runAutoPayout", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => driver_transaction_dto_1.DriverTransactionDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => manual_payout_input_1.ManualPayoutInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [manual_payout_input_1.ManualPayoutInput]),
    tslib_1.__metadata("design:returntype", Promise)
], PayoutResolver.prototype, "manualPayout", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => payout_session_dto_1.PayoutSessionDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    tslib_1.__param(1, (0, graphql_1.Args)('input', { type: () => update_payout_session_input_1.UpdatePayoutSessionInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, update_payout_session_input_1.UpdatePayoutSessionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], PayoutResolver.prototype, "updatePayoutSession", null);
exports.PayoutResolver = PayoutResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(2, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [payout_service_1.PayoutService,
        operator_service_1.OperatorService, Object])
], PayoutResolver);


/***/ }),
/* 283 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayoutMethodStatsDTO = exports.PayoutStatisticsDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(283);
const eager_import_1 = __webpack_require__(160);
const graphql_1 = __webpack_require__(7);
let PayoutStatisticsDTO = class PayoutStatisticsDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { pendingAmount: { type: () => Number }, lastPayoutAmount: { type: () => Number }, usersDefaultPayoutMethodStats: { type: () => [(__webpack_require__(283).PayoutMethodStatsDTO)] }, currency: { type: () => String } };
    }
};
exports.PayoutStatisticsDTO = PayoutStatisticsDTO;
exports.PayoutStatisticsDTO = PayoutStatisticsDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('PayoutStatistics')
], PayoutStatisticsDTO);
let PayoutMethodStatsDTO = class PayoutMethodStatsDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { payoutMethod: { nullable: true, type: () => (__webpack_require__(160).PayoutMethodDTO) }, totalCount: { type: () => Number } };
    }
};
exports.PayoutMethodStatsDTO = PayoutMethodStatsDTO;
exports.PayoutMethodStatsDTO = PayoutMethodStatsDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('PayoutMethodStats')
], PayoutMethodStatsDTO);


/***/ }),
/* 284 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePayoutSessionInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let CreatePayoutSessionInput = class CreatePayoutSessionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { minimumAmount: { type: () => Number }, currency: { type: () => String }, description: { nullable: true, type: () => String } };
    }
};
exports.CreatePayoutSessionInput = CreatePayoutSessionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [graphql_1.ID], {}),
    tslib_1.__metadata("design:type", Array)
], CreatePayoutSessionInput.prototype, "payoutMethodIds", void 0);
exports.CreatePayoutSessionInput = CreatePayoutSessionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreatePayoutSessionInput);


/***/ }),
/* 285 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExportSessionToCsvInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let ExportSessionToCsvInput = class ExportSessionToCsvInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.ExportSessionToCsvInput = ExportSessionToCsvInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], ExportSessionToCsvInput.prototype, "payoutSessionId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ExportSessionToCsvInput.prototype, "payoutMethodId", void 0);
exports.ExportSessionToCsvInput = ExportSessionToCsvInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], ExportSessionToCsvInput);


/***/ }),
/* 286 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RunAutoPayoutInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let RunAutoPayoutInput = class RunAutoPayoutInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.RunAutoPayoutInput = RunAutoPayoutInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], RunAutoPayoutInput.prototype, "payoutSessionId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], RunAutoPayoutInput.prototype, "payoutMethodId", void 0);
exports.RunAutoPayoutInput = RunAutoPayoutInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], RunAutoPayoutInput);


/***/ }),
/* 287 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ManualPayoutInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let ManualPayoutInput = class ManualPayoutInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { transactionNumber: { type: () => String }, description: { nullable: true, type: () => String } };
    }
};
exports.ManualPayoutInput = ManualPayoutInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], ManualPayoutInput.prototype, "driverTransactionId", void 0);
exports.ManualPayoutInput = ManualPayoutInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], ManualPayoutInput);


/***/ }),
/* 288 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePayoutSessionInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const payout_session_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/payout-session-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let UpdatePayoutSessionInput = class UpdatePayoutSessionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.UpdatePayoutSessionInput = UpdatePayoutSessionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => payout_session_status_enum_1.PayoutSessionStatus, {}),
    tslib_1.__metadata("design:type", typeof (_a = typeof payout_session_status_enum_1.PayoutSessionStatus !== "undefined" && payout_session_status_enum_1.PayoutSessionStatus) === "function" ? _a : Object)
], UpdatePayoutSessionInput.prototype, "status", void 0);
exports.UpdatePayoutSessionInput = UpdatePayoutSessionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], UpdatePayoutSessionInput);


/***/ }),
/* 289 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const region_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/region.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const region_dto_1 = __webpack_require__(152);
const region_input_1 = __webpack_require__(290);
let RegionModule = class RegionModule {
};
exports.RegionModule = RegionModule;
exports.RegionModule = RegionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([region_entity_1.RegionEntity])],
                resolvers: [
                    {
                        EntityClass: region_entity_1.RegionEntity,
                        DTOClass: region_dto_1.RegionDTO,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        CreateDTOClass: region_input_1.RegionInput,
                        UpdateDTOClass: region_input_1.RegionInput,
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        enableAggregate: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], RegionModule);


/***/ }),
/* 290 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionInput = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const graphql_1 = __webpack_require__(7);
let RegionInput = class RegionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { name: { type: () => String }, currency: { type: () => String }, enabled: { type: () => Boolean }, location: { type: () => [[(__webpack_require__(72).Point)]] } };
    }
};
exports.RegionInput = RegionInput;
exports.RegionInput = RegionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], RegionInput);


/***/ }),
/* 291 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const reward_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/reward.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const reward_dto_1 = __webpack_require__(292);
let RewardModule = class RewardModule {
};
exports.RewardModule = RewardModule;
exports.RewardModule = RewardModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([reward_entity_1.RewardEntity])],
                resolvers: [
                    {
                        EntityClass: reward_entity_1.RewardEntity,
                        DTOClass: reward_dto_1.RewardDTO,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                    },
                ],
            }),
        ],
    })
], RewardModule);


/***/ }),
/* 292 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
let RewardDTO = class RewardDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, title: { type: () => String }, startDate: { nullable: true, type: () => Date }, endDate: { nullable: true, type: () => Date }, appType: { type: () => Object }, beneficiary: { type: () => Object }, event: { type: () => Object }, creditGift: { type: () => Number }, tripFeePercentGift: { nullable: true, type: () => Number }, creditCurrency: { nullable: true, type: () => String }, conditionTripCountsLessThan: { nullable: true, type: () => Number }, conditionUserNumberFirstDigits: { nullable: true, type: () => [String] } };
    }
};
exports.RewardDTO = RewardDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], RewardDTO.prototype, "id", void 0);
exports.RewardDTO = RewardDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('Reward')
], RewardDTO);


/***/ }),
/* 293 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const rider_address_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/rider-address.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const rider_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/rider-entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const rider_transaction_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/rider-transaction.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const rider_wallet_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/rider-wallet.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_rider_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-rider.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const rider_address_dto_1 = __webpack_require__(177);
const rider_transaction_dto_1 = __webpack_require__(175);
const rider_wallet_dto_1 = __webpack_require__(178);
const rider_dto_1 = __webpack_require__(176);
const rider_resolver_1 = __webpack_require__(294);
const rider_input_1 = __webpack_require__(296);
const driver_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/driver.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let RiderModule = class RiderModule {
};
exports.RiderModule = RiderModule;
exports.RiderModule = RiderModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        rider_entity_1.RiderEntity,
                        driver_entity_1.DriverEntity,
                        rider_wallet_entity_1.RiderWalletEntity,
                        rider_transaction_entity_1.RiderTransactionEntity,
                        rider_address_entity_1.RiderAddressEntity,
                    ]),
                ],
                resolvers: [
                    {
                        EntityClass: rider_entity_1.RiderEntity,
                        DTOClass: rider_dto_1.RiderDTO,
                        CreateDTOClass: rider_input_1.RiderInput,
                        UpdateDTOClass: rider_input_1.RiderInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: rider_wallet_entity_1.RiderWalletEntity,
                        DTOClass: rider_wallet_dto_1.RiderWalletDTO,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: rider_transaction_entity_1.RiderTransactionEntity,
                        DTOClass: rider_transaction_dto_1.RiderTransactionDTO,
                        create: { many: { disabled: true } },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: rider_address_entity_1.RiderAddressEntity,
                        DTOClass: rider_address_dto_1.RiderAddressDTO,
                        create: { many: { disabled: true } },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
        providers: [rider_resolver_1.RiderResolver, shared_rider_service_1.SharedRiderService],
    })
], RiderModule);


/***/ }),
/* 294 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderResolver = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const transaction_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/transaction-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const shared_rider_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/order/shared-rider.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const apollo_1 = __webpack_require__(5);
const jwt_auth_guard_1 = __webpack_require__(133);
const rider_transaction_input_1 = __webpack_require__(295);
const rider_wallet_dto_1 = __webpack_require__(178);
const rider_dto_1 = __webpack_require__(176);
const typeorm_1 = __webpack_require__(11);
let RiderResolver = class RiderResolver {
    constructor(sharedRiderService, context, datasource) {
        this.sharedRiderService = sharedRiderService;
        this.context = context;
        this.datasource = datasource;
    }
    async createRiderTransaction(input) {
        input.amount =
            input.action == transaction_action_enum_1.TransactionAction.Recharge
                ? Math.abs(input.amount)
                : Math.abs(input.amount) * -1;
        return this.sharedRiderService.rechargeWallet({
            ...input,
            operatorId: this.context.req.user.id,
            status: transaction_status_enum_1.TransactionStatus.Done,
        });
    }
    async deleteOneRider(id) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: this.context.req.user.id },
            relations: { role: true },
        });
        if (!operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.Riders_Edit)) {
            throw new apollo_1.ForbiddenError('PERMISSION_NOT_GRANTED');
        }
        return this.sharedRiderService.deleteById(id);
    }
};
exports.RiderResolver = RiderResolver;
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => rider_wallet_dto_1.RiderWalletDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('input', { type: () => rider_transaction_input_1.RiderTransactionInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [rider_transaction_input_1.RiderTransactionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], RiderResolver.prototype, "createRiderTransaction", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => rider_dto_1.RiderDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], RiderResolver.prototype, "deleteOneRider", null);
exports.RiderResolver = RiderResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(1, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof shared_rider_service_1.SharedRiderService !== "undefined" && shared_rider_service_1.SharedRiderService) === "function" ? _a : Object, Object, typeorm_1.DataSource])
], RiderResolver);


/***/ }),
/* 295 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderTransactionInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let RiderTransactionInput = class RiderTransactionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { action: { type: () => Object }, deductType: { nullable: true, type: () => Object }, rechargeType: { nullable: true, type: () => Object }, amount: { type: () => Number }, currency: { type: () => String }, refrenceNumber: { nullable: true, type: () => String }, description: { nullable: true, type: () => String } };
    }
};
exports.RiderTransactionInput = RiderTransactionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], RiderTransactionInput.prototype, "riderId", void 0);
exports.RiderTransactionInput = RiderTransactionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], RiderTransactionInput);


/***/ }),
/* 296 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiderInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let RiderInput = class RiderInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { status: { nullable: true, type: () => Object }, firstName: { nullable: true, type: () => String }, lastName: { nullable: true, type: () => String }, mobileNumber: { nullable: true, type: () => String }, registrationTimestamp: { nullable: true, type: () => Date }, email: { nullable: true, type: () => String }, gender: { nullable: true, type: () => Object }, isResident: { nullable: true, type: () => Boolean }, idNumber: { nullable: true, type: () => String } };
    }
};
exports.RiderInput = RiderInput;
exports.RiderInput = RiderInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], RiderInput);


/***/ }),
/* 297 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const service_category_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/service-category.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const service_option_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/service-option.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const service_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/service.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const zone_price_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/zone-price.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const operator_module_1 = __webpack_require__(201);
const service_category_dto_1 = __webpack_require__(298);
const service_option_dto_1 = __webpack_require__(155);
const service_dto_1 = __webpack_require__(151);
const zone_price_dto_1 = __webpack_require__(252);
const service_category_query_service_1 = __webpack_require__(299);
const service_option_query_service_1 = __webpack_require__(301);
const service_query_service_1 = __webpack_require__(302);
const service_option_input_1 = __webpack_require__(303);
const service_input_1 = __webpack_require__(304);
const service_category_input_1 = __webpack_require__(306);
const zone_price_input_1 = __webpack_require__(307);
let ServiceModule = class ServiceModule {
};
exports.ServiceModule = ServiceModule;
exports.ServiceModule = ServiceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([
                        service_category_entity_1.ServiceCategoryEntity,
                        service_entity_1.ServiceEntity,
                        service_option_entity_1.ServiceOptionEntity,
                        zone_price_entity_1.ZonePriceEntity,
                    ]),
                    operator_module_1.OperatorModule,
                ],
                services: [
                    service_query_service_1.ServiceQueryService,
                    service_category_query_service_1.ServiceCategoryQueryService,
                    service_option_query_service_1.ServiceOptionQueryService,
                ],
                resolvers: [
                    {
                        EntityClass: service_entity_1.ServiceEntity,
                        DTOClass: service_dto_1.ServiceDTO,
                        ServiceClass: service_query_service_1.ServiceQueryService,
                        CreateDTOClass: service_input_1.ServiceInput,
                        UpdateDTOClass: service_input_1.ServiceInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: service_category_entity_1.ServiceCategoryEntity,
                        DTOClass: service_category_dto_1.ServiceCategoryDTO,
                        ServiceClass: service_category_query_service_1.ServiceCategoryQueryService,
                        CreateDTOClass: service_category_input_1.ServiceCategoryInput,
                        UpdateDTOClass: service_category_input_1.ServiceCategoryInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: service_option_entity_1.ServiceOptionEntity,
                        DTOClass: service_option_dto_1.ServiceOptionDTO,
                        CreateDTOClass: service_option_input_1.ServiceOptionInput,
                        UpdateDTOClass: service_option_input_1.ServiceOptionInput,
                        ServiceClass: service_option_query_service_1.ServiceOptionQueryService,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: zone_price_entity_1.ZonePriceEntity,
                        DTOClass: zone_price_dto_1.ZonePriceDTO,
                        CreateDTOClass: zone_price_input_1.ZonePriceInput,
                        UpdateDTOClass: zone_price_input_1.ZonePriceInput,
                        create: { many: { disabled: true } },
                        update: { many: { disabled: true } },
                        delete: { many: { disabled: true } },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
    })
], ServiceModule);


/***/ }),
/* 298 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceCategoryDTO = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/service/dto/service-category.dto.ts
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7); // Додано Field
const service_authorizer_1 = __webpack_require__(156);
const service_dto_1 = __webpack_require__(151);
let ServiceCategoryDTO = class ServiceCategoryDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String } };
    }
};
exports.ServiceCategoryDTO = ServiceCategoryDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], ServiceCategoryDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)() // Дозволяємо фільтрацію за назвою
    ,
    tslib_1.__metadata("design:type", String)
], ServiceCategoryDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, description: 'Детальний опис категорії' }),
    tslib_1.__metadata("design:type", String)
], ServiceCategoryDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, { description: 'Чи активна категорія' }),
    tslib_1.__metadata("design:type", Boolean)
], ServiceCategoryDTO.prototype, "enabled", void 0);
exports.ServiceCategoryDTO = ServiceCategoryDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('ServiceCategory'),
    (0, nestjs_query_graphql_1.UnPagedRelation)('services', () => service_dto_1.ServiceDTO, {
        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
    }),
    (0, nestjs_query_graphql_1.Authorize)(service_authorizer_1.ServiceAuthorizer)
], ServiceCategoryDTO);


/***/ }),
/* 299 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceCategoryQueryService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_core_1 = __webpack_require__(300);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(8);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const service_category_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/service-category.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const operator_service_1 = __webpack_require__(203);
const service_category_dto_1 = __webpack_require__(298);
let ServiceCategoryQueryService = class ServiceCategoryQueryService extends nestjs_query_typeorm_1.TypeOrmQueryService {
    constructor(serviceRepo, operatorService, userContext) {
        super(serviceRepo, { useSoftDelete: true });
        this.operatorService = operatorService;
        this.userContext = userContext;
    }
    async deleteOne(id, opts) {
        await this.operatorService.hasPermission(this.userContext.req.user.id, operator_permission_enum_1.OperatorPermission.Services_Edit);
        return super.deleteOne(id, opts);
    }
};
exports.ServiceCategoryQueryService = ServiceCategoryQueryService;
exports.ServiceCategoryQueryService = ServiceCategoryQueryService = tslib_1.__decorate([
    (0, nestjs_query_core_1.QueryService)(service_category_dto_1.ServiceCategoryDTO),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(service_category_entity_1.ServiceCategoryEntity)),
    tslib_1.__param(2, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        operator_service_1.OperatorService, Object])
], ServiceCategoryQueryService);


/***/ }),
/* 300 */
/***/ ((module) => {

module.exports = require("@ptc-org/nestjs-query-core");

/***/ }),
/* 301 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOptionQueryService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_core_1 = __webpack_require__(300);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(8);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const service_option_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/service-option.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const operator_service_1 = __webpack_require__(203);
const service_option_dto_1 = __webpack_require__(155);
let ServiceOptionQueryService = class ServiceOptionQueryService extends nestjs_query_typeorm_1.TypeOrmQueryService {
    constructor(serviceRepo, operatorService, userContext) {
        super(serviceRepo, { useSoftDelete: true });
        this.operatorService = operatorService;
        this.userContext = userContext;
    }
    async deleteOne(id, opts) {
        await this.operatorService.hasPermission(this.userContext.req.user.id, operator_permission_enum_1.OperatorPermission.Services_Edit);
        return super.deleteOne(id, opts);
    }
};
exports.ServiceOptionQueryService = ServiceOptionQueryService;
exports.ServiceOptionQueryService = ServiceOptionQueryService = tslib_1.__decorate([
    (0, nestjs_query_core_1.QueryService)(service_option_dto_1.ServiceOptionDTO),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(service_option_entity_1.ServiceOptionEntity)),
    tslib_1.__param(2, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        operator_service_1.OperatorService, Object])
], ServiceOptionQueryService);


/***/ }),
/* 302 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceQueryService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_core_1 = __webpack_require__(300);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(8);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const service_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/service.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const operator_service_1 = __webpack_require__(203);
const service_dto_1 = __webpack_require__(151);
let ServiceQueryService = class ServiceQueryService extends nestjs_query_typeorm_1.TypeOrmQueryService {
    constructor(serviceRepo, operatorService, userContext) {
        super(serviceRepo, { useSoftDelete: true });
        this.operatorService = operatorService;
        this.userContext = userContext;
    }
    async deleteOne(id, opts) {
        await this.operatorService.hasPermission(this.userContext.req.user.id, operator_permission_enum_1.OperatorPermission.Services_Edit);
        return super.deleteOne(id, opts);
    }
};
exports.ServiceQueryService = ServiceQueryService;
exports.ServiceQueryService = ServiceQueryService = tslib_1.__decorate([
    (0, nestjs_query_core_1.QueryService)(service_dto_1.ServiceDTO),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(service_entity_1.ServiceEntity)),
    tslib_1.__param(2, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        operator_service_1.OperatorService, Object])
], ServiceQueryService);


/***/ }),
/* 303 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOptionInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/service/dto/service-option.input.ts
const graphql_1 = __webpack_require__(7); // Додано Float
const service_option_dto_1 = __webpack_require__(155); // Імпортуємо нові Enum
let ServiceOptionInput = class ServiceOptionInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.ServiceOptionInput = ServiceOptionInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], ServiceOptionInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => service_option_dto_1.CargoServiceOptionType, {}),
    tslib_1.__metadata("design:type", String)
], ServiceOptionInput.prototype, "type", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    tslib_1.__metadata("design:type", Number)
], ServiceOptionInput.prototype, "additionalFee", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => service_option_dto_1.CargoServiceOptionIcon, {}),
    tslib_1.__metadata("design:type", String)
], ServiceOptionInput.prototype, "icon", void 0);
exports.ServiceOptionInput = ServiceOptionInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], ServiceOptionInput);


/***/ }),
/* 304 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceInput = void 0;
const tslib_1 = __webpack_require__(1);
// apps/admin-api/src/app/service/dto/service.input.ts
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104);
const class_validator_1 = __webpack_require__(233); // NEW: Import validators
const database_1 = __webpack_require__(9); // Assuming VehicleType is exported from database index
const service_payment_method_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/service-payment-method.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const date_range_multiplier_dto_1 = __webpack_require__(113);
const weekday_multiplier_dto_1 = __webpack_require__(112);
const graphql_type_json_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'graphql-type-json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // NEW: Import GraphQLJSONObject
const class_transformer_1 = __webpack_require__(305);
// NEW: Define Input Type for VehicleTariff to enable validation (optional but recommended)
let VehicleTariffInput = class VehicleTariffInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], VehicleTariffInput.prototype, "baseFare", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], VehicleTariffInput.prototype, "perHundredMeters", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], VehicleTariffInput.prototype, "perMinuteDrive", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, {}),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], VehicleTariffInput.prototype, "minimumFee", void 0);
VehicleTariffInput = tslib_1.__decorate([
    (0, graphql_1.InputType)('VehicleTariffInput') // InputType name must be unique
], VehicleTariffInput);
// NEW: Define Input Type for the map using VehicleType keys
// We might need a custom scalar or a workaround if mapping enum keys directly is complex in GraphQL input.
// Using GraphQLJSONObject is simpler for now. Validation might need a custom validator or happen in the service.
// @InputType()
// class VehicleTariffsInput {
//     @Field(() => VehicleTariffInput, { nullable: true })
//     [VehicleType.Pickup]?: VehicleTariffInput; // This direct enum key usage might not work directly in GraphQL schema
//     @Field(() => VehicleTariffInput, { nullable: true })
//     [VehicleType.Van]?: VehicleTariffInput;
//     // ... other vehicle types
// }
let ServiceInput = class ServiceInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { categoryId: { type: () => Number } };
    }
};
exports.ServiceInput = ServiceInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ServiceInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ServiceInput.prototype, "description", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => graphql_1.ID),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject, { nullable: true, description: 'Tariffs per vehicle type (e.g., {"van": {"baseFare": 10, ...}})' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)() // Basic object validation
    // TODO: Add custom validation here or in the service to ensure structure matches VehicleTariffs interface
    ,
    tslib_1.__metadata("design:type", Object)
], ServiceInput.prototype, "vehicleTariffs", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Вартість за годину (очікування/простій/завантаження)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "perHourWait", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true, description: 'Коефіцієнт округлення вартості' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "roundingFactor", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { description: 'Радіус пошуку водіїв (метри)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "searchRadius", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => service_payment_method_enum_1.ServicePaymentMethod, { description: 'Доступні методи оплати' }),
    (0, class_validator_1.IsEnum)(service_payment_method_enum_1.ServicePaymentMethod),
    tslib_1.__metadata("design:type", typeof (_a = typeof service_payment_method_enum_1.ServicePaymentMethod !== "undefined" && service_payment_method_enum_1.ServicePaymentMethod) === "function" ? _a : Object)
], ServiceInput.prototype, "paymentMethod", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Повна вартість скасування для клієнта' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "cancellationTotalFee", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Частка водія від вартості скасування (%)' }) // Assuming this is percent, not flat value
    ,
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "cancellationDriverShare", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Комісія платформи (%)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "providerSharePercent", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Фіксована комісія платформи' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "providerShareFlat", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, description: 'Максимальна відстань поїздки (км)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "maximumDestinationDistance", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [database_1.TimeMultiplier], { nullable: true, description: 'Множники тарифу за часом доби' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => database_1.TimeMultiplier),
    tslib_1.__metadata("design:type", Array)
], ServiceInput.prototype, "timeMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [database_1.DistanceMultiplier], { nullable: true, description: 'Множники тарифу за відстанню' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => database_1.DistanceMultiplier),
    tslib_1.__metadata("design:type", Array)
], ServiceInput.prototype, "distanceMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [weekday_multiplier_dto_1.WeekdayMultiplier], { nullable: true, description: 'Множники тарифу за днями тижня' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => weekday_multiplier_dto_1.WeekdayMultiplier),
    tslib_1.__metadata("design:type", Array)
], ServiceInput.prototype, "weekdayMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [date_range_multiplier_dto_1.DateRangeMultiplier], { nullable: true, description: 'Множники тарифу за діапазоном дат' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => date_range_multiplier_dto_1.DateRangeMultiplier),
    tslib_1.__metadata("design:type", Array)
], ServiceInput.prototype, "dateRangeMultipliers", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    tslib_1.__metadata("design:type", Number)
], ServiceInput.prototype, "mediaId", void 0);
exports.ServiceInput = ServiceInput = tslib_1.__decorate([
    (0, graphql_1.InputType)('AdminServiceInput') // Renamed InputType to avoid conflicts
], ServiceInput);


/***/ }),
/* 305 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 306 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceCategoryInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/service/dto/service-category.input.ts
const graphql_1 = __webpack_require__(7); // Додано Field
let ServiceCategoryInput = class ServiceCategoryInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.ServiceCategoryInput = ServiceCategoryInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], ServiceCategoryInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true, description: 'Детальний опис категорії' }),
    tslib_1.__metadata("design:type", String)
], ServiceCategoryInput.prototype, "description", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => Boolean, { defaultValue: true, description: 'Чи активна категорія' }) // За замовчуванням активна
    ,
    tslib_1.__metadata("design:type", Boolean)
], ServiceCategoryInput.prototype, "enabled", void 0);
exports.ServiceCategoryInput = ServiceCategoryInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], ServiceCategoryInput);


/***/ }),
/* 307 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZonePriceInput = void 0;
const tslib_1 = __webpack_require__(1);
// admin-api/src/app/service/dto/zone-price.input.ts
const graphql_1 = __webpack_require__(7); // Додано Field, Float
const database_1 = __webpack_require__(9);
const zone_price_dto_1 = __webpack_require__(252); // Імпортуємо Enum
let ZonePriceInput = class ZonePriceInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return {};
    }
};
exports.ZonePriceInput = ZonePriceInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, {}),
    tslib_1.__metadata("design:type", String)
], ZonePriceInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [[database_1.Point]], { description: 'Полігони зони ВІДПРАВЛЕННЯ' }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceInput.prototype, "from", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [[database_1.Point]], { description: 'Полігони зони ПРИЗНАЧЕННЯ' }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceInput.prototype, "to", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: 'Значення вартості (залежить від costType)' }),
    tslib_1.__metadata("design:type", Number)
], ZonePriceInput.prototype, "cost", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => zone_price_dto_1.ZonePriceCostType, { description: 'Тип застосування вартості' }),
    tslib_1.__metadata("design:type", String)
], ZonePriceInput.prototype, "costType", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [database_1.TimeMultiplier], { description: 'Множники за часом доби для цього правила зони' }),
    tslib_1.__metadata("design:type", Array)
], ZonePriceInput.prototype, "timeMultipliers", void 0);
exports.ZonePriceInput = ZonePriceInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], ZonePriceInput);


/***/ }),
/* 308 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSProviderModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const nestjs_query_graphql_1 = __webpack_require__(104);
const sms_provider_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/sms-provider.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const sms_provider_dto_1 = __webpack_require__(309);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const typeorm_1 = __webpack_require__(8);
const jwt_auth_guard_1 = __webpack_require__(133);
const sms_provider_service_1 = __webpack_require__(311);
const sms_provider_resolver_1 = __webpack_require__(312);
const sms_provider_input_1 = __webpack_require__(313);
const sms_provider_query_service_1 = __webpack_require__(314);
let SMSProviderModule = class SMSProviderModule {
};
exports.SMSProviderModule = SMSProviderModule;
exports.SMSProviderModule = SMSProviderModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([sms_provider_entity_1.SMSProviderEntity])],
                services: [sms_provider_query_service_1.SMSProviderQueryService],
                resolvers: [
                    {
                        DTOClass: sms_provider_dto_1.SMSProviderDTO,
                        CreateDTOClass: sms_provider_input_1.SMSProviderInput,
                        UpdateDTOClass: sms_provider_input_1.SMSProviderInput,
                        EntityClass: sms_provider_entity_1.SMSProviderEntity,
                        ServiceClass: sms_provider_query_service_1.SMSProviderQueryService,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                        read: {
                            many: {
                                name: 'smsProviders',
                            },
                            one: {
                                name: 'smsProvider',
                            },
                        },
                        delete: {
                            many: { disabled: false },
                        },
                        update: {
                            many: { disabled: false },
                        },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                    },
                ],
            }),
            typeorm_1.TypeOrmModule.forFeature([sms_provider_entity_1.SMSProviderEntity]),
        ],
        providers: [sms_provider_service_1.SMSProviderService, sms_provider_resolver_1.SMSProviderResolver],
    })
], SMSProviderModule);


/***/ }),
/* 309 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSProviderDTO = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const nestjs_query_graphql_1 = __webpack_require__(104);
const sms_provider_authorizer_1 = __webpack_require__(310);
let SMSProviderDTO = class SMSProviderDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, name: { type: () => String }, type: { type: () => Object }, isDefault: { type: () => Boolean }, accountId: { nullable: true, type: () => String }, authToken: { nullable: true, type: () => String }, fromNumber: { nullable: true, type: () => String }, verificationTemplate: { nullable: true, type: () => String }, smsType: { nullable: true, type: () => String } };
    }
};
exports.SMSProviderDTO = SMSProviderDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], SMSProviderDTO.prototype, "id", void 0);
exports.SMSProviderDTO = SMSProviderDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('SMSProvider', {
        description: 'SMS Provider',
    }),
    (0, nestjs_query_graphql_1.Authorize)(sms_provider_authorizer_1.SMSProviderAuthorizer)
], SMSProviderDTO);


/***/ }),
/* 310 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSProviderAuthorizer = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const operator_permission_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/operator-permission.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const operator_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/operator.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_1 = __webpack_require__(11);
let SMSProviderAuthorizer = class SMSProviderAuthorizer {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async authorize(context, authorizerContext) {
        const operator = await this.datasource
            .getRepository(operator_entity_1.OperatorEntity)
            .findOne({
            where: { id: context.req.user.id },
            relations: {
                role: true,
            },
        });
        if (authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.SMSProviders_View)) {
            throw new common_1.UnauthorizedException();
        }
        if (!authorizerContext.readonly &&
            !operator.role.permissions.includes(operator_permission_enum_1.OperatorPermission.SMSProviders_Edit)) {
            if (authorizerContext.operationGroup === 'create' ||
                authorizerContext.operationGroup === 'update' ||
                authorizerContext.operationGroup === 'delete') {
                throw new common_1.UnauthorizedException();
            }
        }
        return undefined;
    }
};
exports.SMSProviderAuthorizer = SMSProviderAuthorizer;
exports.SMSProviderAuthorizer = SMSProviderAuthorizer = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], SMSProviderAuthorizer);


/***/ }),
/* 311 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSProviderService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const sms_provider_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/sms-provider.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
let SMSProviderService = class SMSProviderService {
    constructor(smsProviderRepository) {
        this.smsProviderRepository = smsProviderRepository;
    }
    async markAsDefault(id) {
        await this.smsProviderRepository.update({}, { isDefault: false });
        await this.smsProviderRepository.update({ id }, { isDefault: true });
        const provider = await this.smsProviderRepository.findOneBy({ id });
        return provider;
    }
};
exports.SMSProviderService = SMSProviderService;
exports.SMSProviderService = SMSProviderService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(sms_provider_entity_1.SMSProviderEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], SMSProviderService);


/***/ }),
/* 312 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSProviderResolver = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
const sms_provider_service_1 = __webpack_require__(311);
const sms_provider_dto_1 = __webpack_require__(309);
let SMSProviderResolver = class SMSProviderResolver {
    constructor(smsProviderService) {
        this.smsProviderService = smsProviderService;
    }
    async markSMSProviderAsDefault(id) {
        return await this.smsProviderService.markAsDefault(id);
    }
};
exports.SMSProviderResolver = SMSProviderResolver;
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => sms_provider_dto_1.SMSProviderDTO),
    tslib_1.__param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], SMSProviderResolver.prototype, "markSMSProviderAsDefault", null);
exports.SMSProviderResolver = SMSProviderResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(),
    tslib_1.__metadata("design:paramtypes", [sms_provider_service_1.SMSProviderService])
], SMSProviderResolver);


/***/ }),
/* 313 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSProviderInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let SMSProviderInput = class SMSProviderInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { name: { nullable: true, type: () => String }, type: { nullable: true, type: () => Object }, isDefault: { nullable: true, type: () => Boolean }, accountId: { nullable: true, type: () => String }, authToken: { nullable: true, type: () => String }, fromNumber: { nullable: true, type: () => String }, verificationTemplate: { nullable: true, type: () => String }, smsType: { nullable: true, type: () => String } };
    }
};
exports.SMSProviderInput = SMSProviderInput;
exports.SMSProviderInput = SMSProviderInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], SMSProviderInput);


/***/ }),
/* 314 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSProviderQueryService = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(8);
const nestjs_query_core_1 = __webpack_require__(300);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const sms_provider_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/sms-provider.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const sms_provider_dto_1 = __webpack_require__(309);
let SMSProviderQueryService = class SMSProviderQueryService extends nestjs_query_typeorm_1.TypeOrmQueryService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    async createOne(record) {
        const count = await this.repo.count();
        if (count === 0) {
            record.isDefault = true;
        }
        if (record.isDefault) {
            await this.repo.update({}, { isDefault: false });
        }
        return super.createOne(record);
    }
};
exports.SMSProviderQueryService = SMSProviderQueryService;
exports.SMSProviderQueryService = SMSProviderQueryService = tslib_1.__decorate([
    (0, nestjs_query_core_1.QueryService)(sms_provider_dto_1.SMSProviderDTO),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(sms_provider_entity_1.SMSProviderEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], SMSProviderQueryService);


/***/ }),
/* 315 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const database_1 = __webpack_require__(9);
const sos_activity_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/sos-activity.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const sos_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/sos.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const jwt_auth_guard_1 = __webpack_require__(133);
const create_sos_activity_input_1 = __webpack_require__(316);
const sos_activity_dto_1 = __webpack_require__(317);
const sos_dto_1 = __webpack_require__(318);
const sos_acitivty_query_service_1 = __webpack_require__(319);
const sos_subscription_service_1 = __webpack_require__(320);
let SOSModule = class SOSModule {
};
exports.SOSModule = SOSModule;
exports.SOSModule = SOSModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([sos_entity_1.SOSEntity, sos_activity_entity_1.SOSActivityEntity]),
                ],
                services: [sos_acitivty_query_service_1.SOSActivityQueryService],
                resolvers: [
                    {
                        EntityClass: sos_entity_1.SOSEntity,
                        DTOClass: sos_dto_1.SOSDTO,
                        create: { disabled: true },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.OFFSET,
                        enableTotalCount: true,
                        enableAggregate: true,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                    {
                        EntityClass: sos_activity_entity_1.SOSActivityEntity,
                        DTOClass: sos_activity_dto_1.SOSActivityDTO,
                        CreateDTOClass: create_sos_activity_input_1.CreateSOSAcitivtyInput,
                        ServiceClass: sos_acitivty_query_service_1.SOSActivityQueryService,
                        read: { disabled: true },
                        create: { many: { disabled: true } },
                        update: { disabled: true },
                        delete: { disabled: true },
                        pagingStrategy: nestjs_query_graphql_1.PagingStrategies.NONE,
                        guards: [jwt_auth_guard_1.JwtAuthGuard],
                    },
                ],
            }),
        ],
        providers: [sos_subscription_service_1.SOSSubscriptionService, database_1.RedisPubSubProvider.provider()],
    })
], SOSModule);


/***/ }),
/* 316 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSOSAcitivtyInput = void 0;
const tslib_1 = __webpack_require__(1);
const graphql_1 = __webpack_require__(7);
let CreateSOSAcitivtyInput = class CreateSOSAcitivtyInput {
    static _GRAPHQL_METADATA_FACTORY() {
        return { action: { type: () => Object }, note: { nullable: true, type: () => String } };
    }
};
exports.CreateSOSAcitivtyInput = CreateSOSAcitivtyInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, {}),
    tslib_1.__metadata("design:type", Number)
], CreateSOSAcitivtyInput.prototype, "sosId", void 0);
exports.CreateSOSAcitivtyInput = CreateSOSAcitivtyInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreateSOSAcitivtyInput);


/***/ }),
/* 317 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSActivityDTO = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const operator_dto_1 = __webpack_require__(144);
let SOSActivityDTO = class SOSActivityDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, createdAt: { type: () => Date }, action: { type: () => Object }, note: { nullable: true, type: () => String }, operatorId: { nullable: true, type: () => Number } };
    }
};
exports.SOSActivityDTO = SOSActivityDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], SOSActivityDTO.prototype, "id", void 0);
exports.SOSActivityDTO = SOSActivityDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('SOSActivity'),
    (0, nestjs_query_graphql_1.Relation)('operator', () => operator_dto_1.OperatorDTO)
], SOSActivityDTO);


/***/ }),
/* 318 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSDTO = void 0;
const tslib_1 = __webpack_require__(1);
const eager_import_0 = __webpack_require__(72);
const nestjs_query_graphql_1 = __webpack_require__(104);
const graphql_1 = __webpack_require__(7);
const sos_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/sos-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const order_dto_1 = __webpack_require__(147);
const sos_activity_dto_1 = __webpack_require__(317);
let SOSDTO = class SOSDTO {
    static _GRAPHQL_METADATA_FACTORY() {
        return { id: { type: () => Number }, createdAt: { type: () => Date }, status: { type: () => Object }, location: { nullable: true, type: () => (__webpack_require__(72).Point) }, submittedByRider: { type: () => Boolean }, requestId: { type: () => Number } };
    }
};
exports.SOSDTO = SOSDTO;
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.IDField)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", Number)
], SOSDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, nestjs_query_graphql_1.FilterableField)(() => sos_status_enum_1.SOSStatus),
    tslib_1.__metadata("design:type", typeof (_a = typeof sos_status_enum_1.SOSStatus !== "undefined" && sos_status_enum_1.SOSStatus) === "function" ? _a : Object)
], SOSDTO.prototype, "status", void 0);
exports.SOSDTO = SOSDTO = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('DistressSignal'),
    (0, nestjs_query_graphql_1.UnPagedRelation)('activities', () => sos_activity_dto_1.SOSActivityDTO),
    (0, nestjs_query_graphql_1.Relation)('order', () => order_dto_1.OrderDTO, { relationName: 'request' })
], SOSDTO);


/***/ }),
/* 319 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSActivityQueryService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_core_1 = __webpack_require__(300);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const typeorm_1 = __webpack_require__(8);
const sos_activity_action_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/sos-activity-action.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const sos_status_enum_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/enums/sos-status.enum'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const sos_activity_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/sos-activity.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const sos_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/sos.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const typeorm_2 = __webpack_require__(11);
const sos_activity_dto_1 = __webpack_require__(317);
let SOSActivityQueryService = class SOSActivityQueryService extends nestjs_query_typeorm_1.TypeOrmQueryService {
    constructor(sosActivityRepo, sosRepository, userContext) {
        super(sosActivityRepo);
        this.sosRepository = sosRepository;
        this.userContext = userContext;
    }
    async createOne(record) {
        const activity = await super.createOne({
            ...record,
            operatorId: this.userContext.req.user.id,
        });
        switch (activity.action) {
            case sos_activity_action_enum_1.SOSActivityAction.MarkedAsResolved:
                await this.sosRepository.update(record.sosId, {
                    status: sos_status_enum_1.SOSStatus.Resolved,
                });
                break;
            case sos_activity_action_enum_1.SOSActivityAction.MarkedAsFalseAlarm:
                await this.sosRepository.update(record.sosId, {
                    status: sos_status_enum_1.SOSStatus.FalseAlarm,
                });
                break;
        }
        return activity;
    }
};
exports.SOSActivityQueryService = SOSActivityQueryService;
exports.SOSActivityQueryService = SOSActivityQueryService = tslib_1.__decorate([
    (0, nestjs_query_core_1.QueryService)(sos_activity_dto_1.SOSActivityDTO),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(sos_activity_entity_1.SOSActivityEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(sos_entity_1.SOSEntity)),
    tslib_1.__param(2, (0, common_1.Inject)(graphql_1.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], SOSActivityQueryService);


/***/ }),
/* 320 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SOSSubscriptionService = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const common_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(7);
const graphql_redis_subscriptions_1 = __webpack_require__(105);
const sos_dto_1 = __webpack_require__(318);
let SOSSubscriptionService = class SOSSubscriptionService {
    constructor(pubSub) {
        this.pubSub = pubSub;
    }
    sosCreated() {
        return this.pubSub.asyncIterator('sosCreated');
    }
};
exports.SOSSubscriptionService = SOSSubscriptionService;
tslib_1.__decorate([
    (0, graphql_1.Subscription)(() => sos_dto_1.SOSDTO, {
        filter: (payload, variables, context) => {
            common_1.Logger.log(payload.adminIds.includes(context.user.id));
            return payload.adminIds.includes(context.user.id);
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], SOSSubscriptionService.prototype, "sosCreated", null);
exports.SOSSubscriptionService = SOSSubscriptionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, nestjs_query_graphql_1.InjectPubSub)()),
    tslib_1.__metadata("design:paramtypes", [graphql_redis_subscriptions_1.RedisPubSub])
], SOSSubscriptionService);


/***/ }),
/* 321 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadModule = void 0;
const tslib_1 = __webpack_require__(1);
const nestjs_query_graphql_1 = __webpack_require__(104);
const nestjs_query_typeorm_1 = __webpack_require__(129);
const common_1 = __webpack_require__(2);
const media_entity_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@ridy/database/media.entity'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const media_dto_1 = __webpack_require__(154);
const upload_service_1 = __webpack_require__(190);
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_query_graphql_1.NestjsQueryGraphQLModule.forFeature({
                imports: [nestjs_query_typeorm_1.NestjsQueryTypeOrmModule.forFeature([media_entity_1.MediaEntity])],
                resolvers: [
                    {
                        DTOClass: media_dto_1.MediaDTO,
                        EntityClass: media_entity_1.MediaEntity,
                        create: { disabled: true },
                        read: { disabled: true },
                        delete: { disabled: true },
                        update: { disabled: true },
                    },
                ],
            }),
        ],
        providers: [upload_service_1.UploadService],
        exports: [upload_service_1.UploadService],
    })
], UploadModule);


/***/ }),
/* 322 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-fastify");

/***/ }),
/* 323 */
/***/ ((module) => {

module.exports = require("@fastify/multipart");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const admin_api_module_1 = __webpack_require__(4);
const platform_fastify_1 = __webpack_require__(322);
const multipart_1 = tslib_1.__importDefault(__webpack_require__(323));
const path_1 = __webpack_require__(127);
async function bootstrap() {
    const adapter = new platform_fastify_1.FastifyAdapter();
    const app = await core_1.NestFactory.create(admin_api_module_1.AdminAPIModule.register(), adapter);
    const port = process.env.ADMIN_API_PORT || 3000;
    app.enableShutdownHooks();
    app.enableCors();
    app.register(multipart_1.default, {
        limits: {
            fileSize: 10_000_000,
        },
    });
    app.useStaticAssets({
        root: (0, path_1.join)(process.cwd(), 'uploads'),
        prefix: '/uploads/',
    });
    await app.listen(port, '0.0.0.0', () => {
        common_1.Logger.log(`Listening at http://localhost:${port}`, 'Admin API');
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;