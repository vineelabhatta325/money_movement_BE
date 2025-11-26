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