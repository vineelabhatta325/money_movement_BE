import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';

@Entity('quotes')
export class Quote {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    id!: string;

    @Column({
        type: 'decimal', precision: 15, scale: 2, name: 'amount_usd', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    amountUsd!: number;

    @Column({
        type: 'decimal', precision: 15, scale: 2, name: 'amount_inr', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    amountInr!: number;

    @Column({
        type: 'decimal', precision: 10, scale: 4, transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    rate!: number;

    @Column({ type: 'varchar', length: 50 })
    provider!: string;

    @Column({ type: 'timestamp', name: 'expires_at' })
    expiresAt!: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @OneToMany(() => Transaction, transaction => transaction.quote)
    transactions!: Transaction[];
}
