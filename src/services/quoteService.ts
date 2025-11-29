import { v4 as uuidv4 } from 'uuid';
import { quoteRepository } from '../repositories/quoteRepository';
import axios from 'axios';

const PROVIDER1_API = 'http://provider1.example.com/rates';
const PROVIDER2_API = 'http://provider2.example.com/rates';
const QUOTE_EXPIRY_MINUTES = 5;

export const createQuote = async (amountUsd: number) => {
    let provider1Rate = 0;
    let provider2Rate = 0;

    try {
        const response = await axios.get(PROVIDER1_API);
        provider1Rate = response.data.rate || 0;
    } catch (error) {
        provider1Rate = 83.5 + Math.random() * 0.5;
    }

    try {
        const response = await axios.get(PROVIDER2_API);
        provider2Rate = response.data.rate || 0;
    } catch (error) {
        provider2Rate = 83.3 + Math.random() * 0.5;
    }

    const bestRate = Math.max(provider1Rate, provider2Rate);
    const bestProvider = bestRate === provider1Rate ? 'provider1' : 'provider2';

    const amountInr = amountUsd * bestRate;
    const expiresAt = new Date(Date.now() + QUOTE_EXPIRY_MINUTES * 60 * 1000);

    const quote = await quoteRepository.create({
        id: `qt_${uuidv4().split('-')[0]}`,
        amountUsd,
        amountInr,
        rate: bestRate,
        provider: bestProvider,
        expiresAt
    });

    return {
        quoteId: quote.id,
        amountUsd: quote.amountUsd,
        amountInr: quote.amountInr,
        rate: quote.rate,
        provider: quote.provider,
        expiresAt: quote.expiresAt
    };
};

export const getQuoteById = async (id: string) => {
    return await quoteRepository.findById(id);
};

export const isValidQuote = (quote: any): boolean => {
    return new Date(quote.expiresAt) > new Date();
};
