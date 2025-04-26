// libs/database/src/lib/entities/setting.entity.ts
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('setting')
export class SettingEntity {
    @PrimaryColumn() // Use the setting key as the primary key
    key!: string; // e.g., "loader_cost_per_hour", "currency", "commission_rate"

    @Column('text') // Use text to accommodate various value types (string, number, boolean as string, JSON)
    value!: string;

    @Column({ nullable: true })
    title?: string; // Optional: User-friendly title shown in Admin Panel

    @Column({ nullable: true })
    description?: string; // Optional: Explanation of the setting

    @Column({ default: 'General' })
    group?: string; // Optional: Grouping for Admin Panel (e.g., "Tariffs", "General", "Notifications")

    @Column({ default: false })
    isPublic?: boolean; // Optional: Can this setting be exposed to frontend apps?
}