import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('USD-INR Transfer System API is running');
});

export default app;
