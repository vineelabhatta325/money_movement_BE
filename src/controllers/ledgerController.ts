import { Request, Response } from 'express';
import { ledgerRepository } from '../repositories/ledgerRepository';
import { asyncWrapper } from '../utils/asyncWrapper';

export const getLedgerEntries = asyncWrapper(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const transactionId = req.query.transactionId as string;

    const result = await ledgerRepository.findAll(page, limit, transactionId);

    res.json(result);
});
