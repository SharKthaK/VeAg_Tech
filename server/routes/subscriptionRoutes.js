import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';

const router = express.Router();

// Get active subscription
router.get('/:userId/active', subscriptionController.getActiveSubscription);

// Get subscription history
router.get('/:userId/history', subscriptionController.getSubscriptionHistory);

// Get transaction history
router.get('/:userId/transactions', subscriptionController.getTransactionHistory);

// Create order
router.post('/create-order', subscriptionController.createOrder);

// Verify payment
router.post('/verify-payment', subscriptionController.verifyPayment);

// Handle payment failure
router.post('/payment-failure', subscriptionController.handlePaymentFailure);

export default router;
