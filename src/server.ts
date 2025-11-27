import dotenv from 'dotenv';
import app from './app';
import { initializeDatabase, getConnection } from './data-source';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await initializeDatabase();
        console.log('Connected to database via TypeORM');

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        const shutdown = async () => {
            console.log('Shutting down server...');
            await getConnection().close();
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
