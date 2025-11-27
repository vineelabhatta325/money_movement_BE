import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import * as quoteService from './quoteService';
import * as treasuryService from './treasuryService';

export const createTransaction = async (quoteId: string, senderId: string, bankDetails: any) => {
    const quote = await quoteService.getQuoteById(quoteId);
    if (!quote) {
        throw new Error('Quote not found');
    }
    if (!quoteService.isValidQuote(quote)) {
        throw new Error('Quote expired');
    }
    const amountUsd = parseFloat(quote.amount_usd);
    const deducted = await treasuryService.deductFunds(amountUsd);
    if (!deducted) {
        throw new Error('Insufficient treasury funds');
    }
    const transactionId = `tx_${uuidv4().split('-')[0]}`;
    await query(
        'INSERT INTO transactions (id, quote_id, sender_id, amount_usd, amount_inr, status, bank_details) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [transactionId, quoteId, senderId, amountUsd, quote.amount_inr, 'PENDING', JSON.stringify(bankDetails)]
    );
    // simulatePayout(transactionId); we have to manually call the webhook!!(this method is not required as of now)
    return {
        transactionId,
        status: 'PENDING',
        amountUsd,
        amountInr: quote.amount_inr,
        provider: quote.provider
    };
};

export const getTransactionById = async (id: string) => {
    const res = await query('SELECT * FROM transactions WHERE id = $1', [id]);
    return res.rows[0];
};

export const getAllTransactions = async () => {
    const res = await query('SELECT * FROM transactions ORDER BY created_at DESC');
    return res.rows;
};

export const updateTransactionStatus = async (id: string, status: string) => {
    const res = await query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (res.rows.length === 0) return null;
    return res.rows[0];
};

const simulatePayout = async (transactionId: string) => {
    setTimeout(async () => {
        try {
            console.log(`[Simulation] Payout started for ${transactionId}`);
            await query("UPDATE transactions SET status = 'COMPLETED' WHERE id = $1", [transactionId]);
            console.log(`[Simulation] Payout completed for ${transactionId}`);
        } catch (error) {
            console.error('Payout simulation failed', error);
        }
    }, 5000);
};

