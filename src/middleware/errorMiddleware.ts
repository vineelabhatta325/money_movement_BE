import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/AppError';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, method: req.method, path: req.path }, err.message);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                code: err.constructor.name
            }
        });
    }

    // Fallback for unhandled errors
    return res.status(500).json({
        success: false,
        error: {
            message: 'Internal Server Error',
            code: 'INTERNAL_SERVER_ERROR'
        }
    });
};
