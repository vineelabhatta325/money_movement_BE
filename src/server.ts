import dotenv from 'dotenv';
import app from './app';
import { initializeDatabase, getConnection } from './data-source';
import logger from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await initializeDatabase();
        logger.info('Connected to database via TypeORM');

        const server = app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

        const shutdown = async () => {
            logger.info('Shutting down server...');
            await getConnection().close();
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    } catch (error) {
        logger.error(error, 'Failed to start server');
        process.exit(1);
    }
};

startServer();
