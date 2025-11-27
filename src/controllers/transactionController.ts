import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { quoteId, senderId, bankDetails } = req.body;

        if (!quoteId || !senderId || !bankDetails) {
            return res.status(400).json({ error: 'Missing required fields: quoteId, senderId, bankDetails' });
        }

        const transaction = await transactionService.createTransaction(quoteId, senderId, bankDetails);
        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: (error as Error).message });
    }
};
export const getTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
};

export const getTransactions = async (req: Request, res: Response) => {
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
};
