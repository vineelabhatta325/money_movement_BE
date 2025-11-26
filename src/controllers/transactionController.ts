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