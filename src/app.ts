import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './routes/apiRoutes';
import authRoutes from './routes/authRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
        ip: req.ip
    }, 'Incoming request');
    next();
});

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('USD-INR Transfer System API is running');
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
