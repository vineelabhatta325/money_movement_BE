import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quote } from './Quote';

@Entity('transactions')
export class Transaction {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    id!: string;

    @Column({ type: 'varchar', length: 50, name: 'quote_id', nullable: true })
    quoteId!: string | null;

    @Column({ type: 'varchar', length: 50, name: 'sender_id' })
    senderId!: string;

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

    @Column({ type: 'varchar', length: 20, default: 'PENDING' })
    status!: string;

    @Column({ type: 'jsonb', name: 'bank_details' })
    bankDetails!: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @ManyToOne(() => Quote, quote => quote.transactions)
    @JoinColumn({ name: 'quote_id' })
    quote!: Quote;
}
