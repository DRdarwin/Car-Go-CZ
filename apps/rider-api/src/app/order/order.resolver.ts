import { Inject, Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Args, CONTEXT, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonCouponService } from '@ridy/coupon';
import { Point, RequestEntity } from '@ridy/database';
import { SharedOrderService } from '@ridy/order';
import { DriverRedisService } from '@ridy/redis';
import { UserContextOptional } from '../auth/authenticated-user';
import { GqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { GqlOptionalAuthGuard } from '../auth/jwt-optional-gql-auth.guard';
import { CalculateFareDTO } from './dto/calculate-fare.dto';
import { CalculateFareInput } from './dto/calculate-fare.input';
import { CreateOrderInput } from './dto/create-order.input';
import { CurrentOrder } from './dto/current-order.dto';
import { OrderDTO } from './dto/order.dto';
import { SubmitFeedbackInput } from './dto/submit-feedback.input';
import { RiderOrderService } from './rider-order.service';

@Resolver(() => OrderDTO)
export class OrderResolver {
  constructor(
    @Inject(CONTEXT) private context: UserContextOptional,
    private orderService: SharedOrderService,
    private riderOrderService: RiderOrderService,
    private driverRedisService: DriverRedisService,
    private commonCouponService: CommonCouponService,
  ) { }

  @Query(() => OrderDTO, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async currentOrder(): Promise<OrderDTO | null> {
    const user = this.context.req.user;
    if (!user) throw new UnauthorizedException();
    return this.riderOrderService.getCurrentOrder(user.id, [
      'driver',
      'driver.carColor',
      'driver.car',
      'conversation',
    ]);
  }

  @Query(() => CurrentOrder, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async currentOrderWithLocation(): Promise<CurrentOrder | null> {
    const user = this.context.req.user;
    if (!user) throw new UnauthorizedException();
    const order = await this.riderOrderService.getCurrentOrder(user.id, [
      'driver',
      'driver.carColor',
      'driver.car',
    ]);
    let driverLocation: Point | undefined;
    if (order?.driver) {
      driverLocation = await this.driverRedisService.getDriverCoordinate(order.driver.id);
    }
    return { order, driverLocation };
  }

  @Mutation(() => CalculateFareDTO)
  @UseGuards(GqlAuthGuard)
  async calculateFare(
    @Args('input', { type: () => CalculateFareInput }) input: CalculateFareInput,
  ): Promise<CalculateFareDTO> {
    const user = this.context.req.user;
    if (!user) throw new UnauthorizedException();
    const coupon = input.couponCode
      ? await this.commonCouponService.checkCoupon(input.couponCode, user.id)
      : undefined;
    return this.orderService.calculateFare({
      points: input.points,
      vehicleType: input.vehicleType,
      loadersCount: input.loadersCount,
      coupon,
      riderId: user.id,
      twoWay: input.twoWay,
      waitTime: input.waitTime,
      selectedOptionIds: input.selectedOptionIds,
    });
  }

  @Query(() => CalculateFareDTO)
  @UseGuards(GqlAuthGuard)
  async getFares(
    @Args('input', { type: () => CalculateFareInput }) input: CalculateFareInput,
  ): Promise<CalculateFareDTO> {
    const user = this.context.req.user;
    if (!user) throw new UnauthorizedException();
    Logger.log(`Getting fares for userId:${user.id}`);
    const coupon =
      input.couponCode && input.couponCode.length > 0
        ? await this.commonCouponService.checkCoupon(input.couponCode, user.id)
        : undefined;
    return this.orderService.calculateFare({
      points: input.points,
      vehicleType: input.vehicleType,
      loadersCount: input.loadersCount,
      coupon,
      riderId: user.id,
      twoWay: input.twoWay,
      waitTime: input.waitTime,
      selectedOptionIds: input.selectedOptionIds,
    });
  }

  @Query(() => CalculateFareDTO)
  @UseGuards(GqlOptionalAuthGuard)
  async getFare(
    @Args('input', { type: () => CalculateFareInput }) input: CalculateFareInput,
  ): Promise<CalculateFareDTO> {
    const user = this.context.req.user;
    Logger.log(`Getting fare for userId:${user?.id}`);
    const coupon =
      user && input.couponCode && input.couponCode.length > 0
        ? await this.commonCouponService.checkCoupon(input.couponCode, user.id)
        : undefined;
    return this.orderService.calculateFare({
      ...input,
      coupon,
      riderId: user?.id,
    });
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @Args('input', { type: () => CreateOrderInput }) input: CreateOrderInput,
  ): Promise<OrderDTO> {
    const user = this.context.req.user;
    if (!user) throw new UnauthorizedException();
    return this.orderService.createOrder({
      ...input,
      riderId: user.id,
      optionIds: input.optionIds,
      waitMinutes: input.waitTime,
      twoWay: input.twoWay,
    });
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async cancelOrder(
    @Args('orderId', { type: () => ID, nullable: true }) orderId?: number,
    @Args('cancelReasonId', { type: () => ID, nullable: true }) cancelReasonId?: number,
    @Args('cancelReasonNote', { type: () => String, nullable: true }) cancelReasonNote?: string,
  ): Promise<OrderDTO> {
    const user = this.context.req.user;
    if (!user) throw new UnauthorizedException();
    if (orderId) {
      return this.riderOrderService.cancelOrder({
        orderId,
        reasonId: cancelReasonId,
        reason: cancelReasonNote,
      });
    }
    return this.riderOrderService.cancelRiderLastOrder({
      riderId: user.id,
      reasonId: cancelReasonId,
      reason: cancelReasonNote,
    });
  }

  @Mutation(() => OrderDTO)
  @UseGuards(GqlAuthGuard)
  async cancelBooking(
    @Args('id', { type: () => ID }) id: number,
    @Args('cancelReasonId', { type: () => ID, nullable: true }) cancelReasonId?: number,
    @Args('cancelReasonNote', { type: () => String, nullable: true }) cancelReasonNote?: string,
  ): Promise<OrderDTO> {
    return this.riderOrderService.cancelOrder({
      orderId: id,
      reasonId: cancelReasonId,
      reason: cancelReasonNote,
    });
  }

  @Query(() => Point, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getCurrentOrderDriverLocation(): Promise<Point | null> {
    const user = this.context.req.user;
    if (!user) throw new UnauthorizedException();
    const order = await this.riderOrderService.getCurrentOrder(user.id);
    if (order?.driverId) {
      Logger.log(`driver id: ${order.driverId}`);
      const coordinate = await this.driverRedisService.getDriverCoordinate(order.driverId);
      Logger.log(JSON.stringify(coordinate));
      return coordinate;
    }
    return null;
  }

  @Query(() => [Point])
  @UseGuards(GqlOptionalAuthGuard)
  async getDriversLocation(
    @Args('center', { type: () => Point, nullable: true }) center?: Point,
  ): Promise<Point[]> {
    if (!center) return [];
    return this.driverRedisService.getCloseWithoutIds(center, 1000);
  }

  @Mutation(() => RequestEntity)
  @UseGuards(GqlAuthGuard)
  async submitReview(
    @Args('review', { type: () => SubmitFeedbackInput }) review: SubmitFeedbackInput,
  ): Promise<RequestEntity> {
    const user = this.context.req.user!;
    return this.riderOrderService.submitReview(user.id, review);
  }

  @Mutation(() => RequestEntity)
  @UseGuards(GqlAuthGuard)
  async skipReview(): Promise<RequestEntity> {
    const user = this.context.req.user!;
    return this.riderOrderService.skipReview(user.id);
  }
}