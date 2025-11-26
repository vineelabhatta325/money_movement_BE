import dotenv from 'dotenv';
import app from './app';
import { initDb } from './db';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await initDb();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
