import { v4 as uuidv4 } from 'uuid';
import { transactionRepository } from '../repositories/transactionRepository';
import { ledgerRepository } from '../repositories/ledgerRepository';
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
        quoteId,
        senderId,
        amountUsd,
        amountInr: parseFloat(quote.amountInr.toString()),
        status: 'PENDING',
        bankDetails
    });

    await ledgerRepository.createEntry({
        transactionId,
        eventType: 'QUOTE_LOCKED',
        entityType: 'TREASURY',
        entityId: '1',
        entryType: 'DEBIT',
        amount: amountUsd,
        currency: 'USD',
        balanceAfter: await treasuryService.getBalance()
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

export const getAllTransactions = async (
    page?: number,
    limit?: number,
    searchId?: string,
    startDate?: Date,
    endDate?: Date,
    status?: string
) => {
    return await transactionRepository.findAll(page, limit, searchId, startDate, endDate, status);
};

export const getTransactionCount = async (
    searchId?: string,
    startDate?: Date,
    endDate?: Date,
    status?: string
) => {
    return await transactionRepository.getCount(searchId, startDate, endDate, status);
};

export const updateTransactionStatus = async (id: string, status: string) => {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    const result = await transactionRepository.updateStatus(id, status);
    if (status === 'PROCESSING') {
        await ledgerRepository.createEntry({
            transactionId: id,
            eventType: 'PAYOUT_INITIATED',
            entityType: 'BENEFICIARY',
            entityId: transaction.bankDetails?.AccountNumber || 'unknown',
            entryType: 'CREDIT',
            amount: parseFloat(transaction.amountInr.toString()),
            currency: 'INR',
            balanceAfter: null
        });
    } else if (status === 'COMPLETED') {
        await ledgerRepository.createEntry({
            transactionId: id,
            eventType: 'PAYOUT_COMPLETED',
            entityType: 'BENEFICIARY',
            entityId: transaction.bankDetails?.AccountNumber || transaction.bankDetails?.accountNumber || 'unknown',
            entryType: 'CREDIT',
            amount: parseFloat(transaction.amountInr.toString()),
            currency: 'INR',
            balanceAfter: null
        });
    } else if (status === 'FAILED') {
        // Refund to treasury
        await ledgerRepository.createEntry({
            transactionId: id,
            eventType: 'TRANSACTION_FAILED',
            entityType: 'TREASURY',
            entityId: '1',
            entryType: 'CREDIT',
            amount: parseFloat(transaction.amountUsd.toString()),
            currency: 'USD',
            balanceAfter: await treasuryService.getBalance()
        });
    }
    return result;
};

export const getBeneficiaries = async () => {
    return await transactionRepository.getUniqueBeneficiaries();
};
