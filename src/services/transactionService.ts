import { v4 as uuidv4 } from 'uuid';
import { transactionRepository } from '../repositories/transactionRepository';
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

    const amountUsd = parseFloat(quote.amountUsd.toString());
    const deducted = await treasuryService.deductFunds(amountUsd);
    if (!deducted) {
        throw new Error('Insufficient treasury funds');
    }

    const transactionId = `tx_${uuidv4().split('-')[0]}`;

    await transactionRepository.create({
        id: transactionId,
        quoteId: quoteId,
        senderId: senderId,
        amountUsd: amountUsd,
        amountInr: parseFloat(quote.amountInr.toString()),
        status: 'PENDING',
        bankDetails: bankDetails
    });

    return {
        transactionId,
        status: 'PENDING',
        amountUsd,
        amountInr: quote.amountInr,
        provider: quote.provider
    };
};

export const getTransactionById = async (id: string) => {
    return await transactionRepository.findById(id);
};

export const getAllTransactions = async (page?: number, limit?: number) => {
    return await transactionRepository.findAll(page, limit);
};

export const getTransactionCount = async () => {
    return await transactionRepository.getCount();
};

export const updateTransactionStatus = async (id: string, status: string) => {
    return await transactionRepository.updateStatus(id, status);
};
