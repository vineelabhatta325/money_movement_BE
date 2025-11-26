export interface Transaction {
    id: string;
    amountUSD: number;
    exchangeRate: number;
    targetAmountINR: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
}

// In-memory store
export const transactions: Transaction[] = [];
