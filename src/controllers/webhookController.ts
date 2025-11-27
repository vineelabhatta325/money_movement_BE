
import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const updateTransactionStatus = (req: Request, res: Response) => {
    const { transactionId, status } = req.body;

    if (!transactionId || !status) {
        return res.status(400).json({ error: 'Missing transactionId or status' });
    }

    const updatedTransaction = transactionService.updateTransactionStatus(transactionId, status);

    if (!updatedTransaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
};



