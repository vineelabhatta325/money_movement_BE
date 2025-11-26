import { query } from '../db';

export const getBalance = async (): Promise<number> => {
    const res = await query('SELECT balance_usd FROM treasury WHERE id = 1');
    if (res.rows.length > 0) {
        return parseFloat(res.rows[0].balance_usd);
    }
    return 0;
};

export const deductFunds = async (amount: number): Promise<boolean> => {
    // Atomic update: only deduct if balance >= amount
    const res = await query(
        'UPDATE treasury SET balance_usd = balance_usd - $1 WHERE id = 1 AND balance_usd >= $1 RETURNING balance_usd',
        [amount]
    );
    return (res.rowCount || 0) > 0;
};
