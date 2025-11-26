import express from 'express';
import * as quotationController from '../controllers/quotationController';
import * as transactionController from '../controllers/transactionController';

const router = express.Router();

// Quotation API
router.post('/quotation', quotationController.getQuotation);

// Transaction APIs
router.post('/transaction', transactionController.createTransaction);

export default router;
