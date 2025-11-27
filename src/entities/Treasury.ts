import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('treasury')
export class Treasury {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'decimal', precision: 15, scale: 2, name: 'balance_usd', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    balanceUsd!: number;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
