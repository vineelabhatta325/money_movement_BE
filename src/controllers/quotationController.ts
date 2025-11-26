import { Request, Response } from 'express';
import * as quoteService from '../services/quoteService';

export const getQuotation = async (req: Request, res: Response) => {
    try {
        const { amountUsd } = req.body;
        if (!amountUsd || amountUsd <= 0) {
            return res.status(400).json({ error: 'Invalid amountUsd' });
        }

        const quote = await quoteService.createQuote(amountUsd);
        res.json(quote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create quote' });
    }
};
