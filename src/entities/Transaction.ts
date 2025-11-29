import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quote } from './Quote';

@Entity('Transactions')
export class Transaction {
    @PrimaryColumn({ type: 'varchar', length: 50, name: 'Id' })
    id!: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'QuoteId' })
    quoteId!: string | null;

    @Column({ type: 'varchar', length: 50, name: 'SenderId' })
    senderId!: string;

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

    @Column({ type: 'varchar', length: 20, default: 'PENDING', name: 'Status' })
    status!: string;

    @Column({ type: 'jsonb', name: 'BankDetails' })
    bankDetails!: any;

    @CreateDateColumn({ name: 'CreatedAt' })
    createdAt!: Date;

    @ManyToOne(() => Quote, quote => quote.transactions)
    @JoinColumn({ name: 'QuoteId' })
    quote!: Quote;
}
