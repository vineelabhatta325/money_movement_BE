import { Request, Response } from 'express';
import * as quoteService from '../services/quoteService';
import { ValidationError } from '../utils/AppError';
import { asyncWrapper } from '../utils/asyncWrapper';

export const getQuotation = asyncWrapper(async (req: Request, res: Response) => {
    const { amountUsd } = req.body;
    if (!amountUsd || amountUsd <= 0) {
        throw new ValidationError('Invalid amount');
    }

    const quote = await quoteService.createQuote(parseFloat(amountUsd));
    res.json(quote);
});
