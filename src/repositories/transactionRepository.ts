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
    async findAll(
        page?: number,
        limit?: number,
        searchId?: string,
        startDate?: Date,
        endDate?: Date,
        status?: string
    ) {
        const transactionRepo = getConnection().getRepository(Transaction);
        let query = transactionRepo
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.quote', 'quote')
            .orderBy('transaction.createdAt', 'DESC');
        if (searchId) {
            query = query.andWhere('transaction.id LIKE :searchId', { searchId: `%${searchId}%` });
        }
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            query = query.andWhere('transaction.createdAt >= :startDate', { startDate: start });
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query = query.andWhere('transaction.createdAt <= :endDate', { endDate: end });
        }

        if (status) {
            query = query.andWhere('transaction.status = :status', { status });
        }
        if (page !== undefined && limit !== undefined) {
            query = query.skip((page - 1) * limit).take(limit);
        }
        const transactions = await query.getMany();

        return transactions.map(t => ({
            ...t,
            provider: t.quote?.provider
        }));
    }

    async getCount(searchId?: string, startDate?: Date, endDate?: Date, status?: string) {
        const transactionRepo = getConnection().getRepository(Transaction);
        let query = transactionRepo.createQueryBuilder('transaction');
        if (searchId) {
            query = query.andWhere('transaction.id LIKE :searchId', { searchId: `%${searchId}%` });
        }
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            query = query.andWhere('transaction.createdAt >= :startDate', { startDate: start });
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query = query.andWhere('transaction.createdAt <= :endDate', { endDate: end });
        }

        if (status) {
            query = query.andWhere('transaction.status = :status', { status });
        }

        return await query.getCount();
    }

    async updateStatus(id: string, status: string) {
        const transactionRepo = getConnection().getRepository(Transaction);
        await transactionRepo.update({ id }, { status });
        return await transactionRepo.findOne({ where: { id } });
    }

    async getUniqueBeneficiaries() {
        const transactionRepo = getConnection().getRepository(Transaction);
        const transactions = await transactionRepo
            .createQueryBuilder('transaction')
            .select('transaction.bankDetails')
            .getMany();
        const uniqueBeneficiaries = new Map();
        transactions.forEach(t => {
            if (t.bankDetails && t.bankDetails.accountNumber) {
                uniqueBeneficiaries.set(t.bankDetails.accountNumber, t.bankDetails);
            }
        });

        return Array.from(uniqueBeneficiaries.values());
    }
}

export const transactionRepository = new TransactionRepository();
