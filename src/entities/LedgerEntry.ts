import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('LedgerEntries')
export class LedgerEntry {
    @PrimaryGeneratedColumn('uuid', { name: 'Id' })
    id!: string;

    @Column({ nullable: true, name: 'TransactionId' })
    transactionId!: string;

    // QUOTE_LOCKED, PAYOUT_INITIATED, PAYOUT_COMPLETED, TREASURY_FUNDED
    @Column({ name: 'EventType' })
    eventType!: string;

    // USER, TREASURY, PROVIDER
    @Column({ name: 'EntityType' })
    entityType!: string;

    @Column({ name: 'EntityId' })
    entityId!: string;

    // DEBIT, CREDIT
    @Column({ name: 'EntryType' })
    entryType!: string;

    @Column({
        type: 'decimal', precision: 10, scale: 2, name: 'Amount', transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    amount!: number;

    @Column({ name: 'Currency' })
    currency!: string;

    @Column({
        type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'BalanceAfter', transformer: {
            to: (value: number | null) => value,
            from: (value: string | null) => value ? parseFloat(value) : null
        }
    })
    balanceAfter!: number | null;

    @CreateDateColumn({ name: 'CreatedAt' })
    createdAt!: Date;
}
