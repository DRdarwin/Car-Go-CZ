// libs/database/src/lib/entities/vehicle.entity.ts
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VehicleType } from './enums/vehicle-type.enum';
import { DriverEntity } from './driver.entity';
import { MediaEntity } from './media.entity'; // Optional: If vehicles have photos

@Entity('vehicle')
export class VehicleEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string; // e.g., "Mercedes Sprinter", "Ford Transit"

    @Column({ unique: true })
    plateNumber!: string;

    @Column('enum', {
        enum: VehicleType,
        nullable: false, // Vehicle type is mandatory
    })
    type!: VehicleType; // pickup, van, truck, covered-truck

    // Add other relevant vehicle details if needed
    @Column({ nullable: true })
    color?: string; // e.g., "White"

    @Column('int', { nullable: true })
    productionYear?: number;

    @Column('int', { nullable: true })
    loadCapacityKg?: number; // Optional: Load capacity

    // Relation back to Driver (One vehicle belongs to one Driver)
    @OneToOne(() => DriverEntity, driver => driver.vehicle)
    driver?: DriverEntity; // Optional: a vehicle might not be assigned yet

    // Optional: Link to a photo of the vehicle
    @OneToOne(() => MediaEntity, { nullable: true })
    @JoinColumn()
    media?: MediaEntity;

    @Column({ nullable: true })
    mediaId?: number;
}