
import express from 'express';
import * as quotationController from '../controllers/quotationController';
import * as transactionController from '../controllers/transactionController';
import * as webhookController from '../controllers/webhookController';
import * as ledgerController from '../controllers/ledgerController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/quotation', quotationController.getQuotation);
router.post('/transaction', authMiddleware, transactionController.createTransaction);
router.get('/transaction/:id', authMiddleware, transactionController.getTransaction);
router.get('/transactions', authMiddleware, transactionController.getTransactions);
router.get('/beneficiaries', authMiddleware, transactionController.getBeneficiaries);
router.get('/ledger', authMiddleware, ledgerController.getLedgerEntries);
router.post('/webhook', webhookController.updateTransactionStatus);

export default router;
