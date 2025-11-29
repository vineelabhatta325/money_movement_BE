import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';

@Entity('Quotes')
export class Quote {
    @PrimaryColumn({ type: 'varchar', length: 50, name: 'Id' })
    id!: string;

    @Column({
        type: 'decimal', precision: 15, scale: 2, name: 'AmountUsd', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    amountUsd!: number;

    @Column({
        type: 'decimal', precision: 15, scale: 2, name: 'AmountInr', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    amountInr!: number;

    @Column({
        type: 'decimal', precision: 10, scale: 4, name: 'Rate', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    rate!: number;

    @Column({ type: 'varchar', length: 50, name: 'Provider' })
    provider!: string;

    @Column({ type: 'timestamp', name: 'ExpiresAt' })
    expiresAt!: Date;

    @CreateDateColumn({ name: 'CreatedAt' })
    createdAt!: Date;

    @OneToMany(() => Transaction, transaction => transaction.quote)
    transactions!: Transaction[];
}
