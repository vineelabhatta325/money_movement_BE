import { getConnection } from '../data-source';
import { Treasury } from '../entities/Treasury';

export const getBalance = async (): Promise<number> => {
    const treasuryRepo = getConnection().getRepository(Treasury);
    const res = await treasuryRepo.findOne({ where: { id: 1 } });

    if (res) {
        return res.balanceUsd;
    }
    return 0;
};

export const deductFunds = async (amount: number): Promise<boolean> => {
    const treasuryRepo = getConnection().getRepository(Treasury);
    const result = await treasuryRepo
        .createQueryBuilder()
        .update(Treasury)
        .set({ balanceUsd: () => `"BalanceUsd" - ${amount}` })
        .where('"Id" = :id', { id: 1 })
        .andWhere('"BalanceUsd" >= :amount', { amount })
        .execute();

    return result.affected !== undefined && result.affected > 0;
};
