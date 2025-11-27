
import express from 'express';
import * as quotationController from '../controllers/quotationController';
import * as transactionController from '../controllers/transactionController';
import * as webhookController from '../controllers/webhookController';
const router = express.Router();
// Quotation API
router.post('/quotation', quotationController.getQuotation);
// Transaction APIs
router.post('/transaction', transactionController.createTransaction);
router.get('/transaction/:id', transactionController.getTransaction);
router.get('/transactions', transactionController.getTransactions);
router.get('/beneficiaries', transactionController.getBeneficiaries);
router.post('/webhook', webhookController.updateTransactionStatus);

export default router;
