import { getConnection } from '../data-source';
import { LedgerEntry } from '../entities/LedgerEntry';

export const ledgerRepository = {
    createEntry: async (entryData: Partial<LedgerEntry>) => {
        const repository = getConnection().getRepository(LedgerEntry);
        const entry = repository.create(entryData);
        return await repository.save(entry);
    },
    findAll: async (page: number = 1, limit: number = 10, transactionId?: string) => {
        const repository = getConnection().getRepository(LedgerEntry);
        const query = repository.createQueryBuilder('ledger')
            .orderBy('ledger.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        if (transactionId) {
            query.where('ledger.transactionId = :transactionId', { transactionId });
        }

        const [entries, total] = await query.getManyAndCount();

        return {
            entries,
            totalCount: total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
};
