import { ObjectType } from "@nestjs/graphql";
import { Point } from "@ridy/database";
import { DriverStatus, Gender } from '@ridy/database';

@ObjectType()
export class OnlineDriver {
    location: Point;
    driverId: number;
    lastUpdatedAt: number;
}

@ObjectType()
export class OnlineDriverWithData {
    id: number;
    location: Point;
    lastUpdatedAt: number;
    firstName?: string;
    lastName?: string;
    mobileNumber: string;
    status: DriverStatus;
    gender?: Gender;
    rating?: number;
    reviewCount: number;
}