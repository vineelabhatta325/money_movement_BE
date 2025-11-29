import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';
import * as treasuryService from '../services/treasuryService';
import { ValidationError } from '../utils/AppError';
import { asyncWrapper } from '../utils/asyncWrapper';

export const createTransaction = asyncWrapper(async (req: Request, res: Response) => {
    const { quoteId, senderId, bankDetails } = req.body;

    if (!quoteId || !senderId || !bankDetails) {
        throw new ValidationError('Missing required fields');
    }

    const result = await transactionService.createTransaction(quoteId, senderId, bankDetails);
    res.json(result);
});

export const getTransaction = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);

    if (!transaction) {
        throw new ValidationError('Transaction not found');
    }

    res.json(transaction);
});

export const getTransactions = asyncWrapper(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchId = req.query.searchId as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const status = req.query.status as string;

    const transactions = await transactionService.getAllTransactions(
        page, limit, searchId, startDate, endDate, status
    );
    const totalCount = await transactionService.getTransactionCount(searchId, startDate, endDate, status);
    const treasuryBalance = await treasuryService.getBalance();

    res.json({
        transactions,
        treasuryBalance,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            limit
        }
    });
});

export const getBeneficiaries = asyncWrapper(async (req: Request, res: Response) => {
    const beneficiaries = await transactionService.getBeneficiaries();
    res.json(beneficiaries);
});
