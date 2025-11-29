import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';
import { ValidationError } from '../utils/AppError';
import { asyncWrapper } from '../utils/asyncWrapper';

export const updateTransactionStatus = asyncWrapper(async (req: Request, res: Response) => {
    const { transactionId, status } = req.body;

    if (!transactionId || !status) {
        throw new ValidationError('Missing transaction ID or status');
    }

    const result = await transactionService.updateTransactionStatus(transactionId, status);
    res.json(result);
});
