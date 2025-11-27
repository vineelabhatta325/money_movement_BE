import { v4 as uuidv4 } from 'uuid';
import { addSeconds, isBefore } from 'date-fns';
import { quoteRepository } from '../repositories/quoteRepository';
import * as rateService from './rateService';

export const createQuote = async (amountUsd: number) => {
    const bestRate = await rateService.getBestQuote(amountUsd);
    const quoteId = `q_${uuidv4().split('-')[0]}`;
    const expiresAt = addSeconds(new Date(), 300);

    await quoteRepository.create({
        id: quoteId,
        amountUsd: amountUsd,
        amountInr: bestRate.amountInr,
        rate: bestRate.rateUsed,
        provider: bestRate.provider,
        expiresAt: expiresAt
    });

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
    return await quoteRepository.findById(quoteId);
};

export const isValidQuote = (quote: any): boolean => {
    if (!quote) return false;
    return isBefore(new Date(), new Date(quote.expiresAt));
};
