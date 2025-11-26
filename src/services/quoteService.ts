import { v4 as uuidv4 } from 'uuid';
import { addSeconds, isBefore } from 'date-fns';
import { query } from '../db';
import * as rateService from './rateService';

export const createQuote = async (amountUsd: number) => {
    const bestRate = await rateService.getBestQuote(amountUsd);
    const quoteId = `q_${uuidv4().split('-')[0]}`;
    const expiresAt = addSeconds(new Date(), 300);

    await query(
        'INSERT INTO quotes (id, amount_usd, amount_inr, rate, provider, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [quoteId, amountUsd, bestRate.amountInr, bestRate.rateUsed, bestRate.provider, expiresAt]
    );

    return {
        quoteId,
        amountUsd,
        amountInr: bestRate.amountInr,
        rateUsed: bestRate.rateUsed,
        provider: bestRate.provider,
        expiresAt
    };
};

export const getQuoteById = async (quoteId: string) => {
    const res = await query('SELECT * FROM quotes WHERE id = $1', [quoteId]);
    if (res.rows.length === 0) return null;
    return res.rows[0];
};

export const isValidQuote = (quote: any): boolean => {
    if (!quote) return false;
    return isBefore(new Date(), new Date(quote.expires_at));
};
