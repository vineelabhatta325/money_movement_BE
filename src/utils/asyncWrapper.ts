import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { AppError } from './AppError';

export const asyncWrapper = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            logger.error({ error: error.message, stack: error.stack }, 'Error in request handler');
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};
