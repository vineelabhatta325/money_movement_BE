import { getConnection } from '../data-source';
import { Transaction } from '../entities/Transaction';

export class TransactionRepository {
    async create(transactionData: Partial<Transaction>) {
        const transactionRepo = getConnection().getRepository(Transaction);
        return await transactionRepo.save(transactionData);
    }

    async findById(id: string) {
        const transactionRepo = getConnection().getRepository(Transaction);
        const transaction = await transactionRepo.findOne({
            where: { id },
            relations: ['quote']
        });

        if (transaction && transaction.quote) {
            return {
                ...transaction,
                provider: transaction.quote.provider
            };
        }
        return transaction;
    }

    async findAll(page?: number, limit?: number) {
        const transactionRepo = getConnection().getRepository(Transaction);

        let query = transactionRepo
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.quote', 'quote')
            .orderBy('transaction.createdAt', 'DESC');

        if (page !== undefined && limit !== undefined) {
            query = query.skip((page - 1) * limit).take(limit);
        }

        const transactions = await query.getMany();

        return transactions.map(t => ({
            ...t,
            provider: t.quote?.provider
        }));
    }

    async getCount() {
        const transactionRepo = getConnection().getRepository(Transaction);
        return await transactionRepo.count();
    }

    async updateStatus(id: string, status: string) {
        const transactionRepo = getConnection().getRepository(Transaction);
        await transactionRepo.update({ id }, { status });
        return await transactionRepo.findOne({ where: { id } });
    }
}

export const transactionRepository = new TransactionRepository();
