import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('Treasury')
export class Treasury {
    @PrimaryGeneratedColumn({ name: 'Id' })
    id!: number;

    @Column({
        type: 'decimal', precision: 15, scale: 2, name: 'BalanceUsd', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    balanceUsd!: number;

    @UpdateDateColumn({ name: 'UpdatedAt' })
    updatedAt!: Date;
}
