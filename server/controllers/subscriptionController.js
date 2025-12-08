const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Plan pricing configuration
const PLAN_CONFIG = {
  basePrice: 10, // Rs 10 per month
  discount: 0.10, // 10% discount
  finalPrice: 9, // Rs 9 per month after discount
  maxMonths: 12,
  minMonths: 1
};

// Get user's active subscription
exports.getActiveSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne({ 
      userId, 
      isActive: true 
    }).sort({ endDate: -1 });

    if (!subscription) {
      return res.json({ 
        hasActivePlan: false, 
        subscription: null 
      });
    }

    // Check if subscription is expired
    if (subscription.isExpired()) {
      subscription.isActive = false;
      await subscription.save();
      return res.json({ 
        hasActivePlan: false, 
        subscription: null 
      });
    }

    res.json({
      hasActivePlan: true,
      subscription: {
        ...subscription.toObject(),
        daysRemaining: subscription.getDaysRemaining()
      }
    });
  } catch (error) {
    console.error('Error fetching active subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

// Get all subscriptions (plan history)
exports.getSubscriptionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 });

    const history = subscriptions.map(sub => ({
      ...sub.toObject(),
      daysRemaining: sub.getDaysRemaining(),
      isExpired: sub.isExpired()
    }));

    res.json({ subscriptions: history });
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ error: 'Failed to fetch subscription history' });
  }
};

// Get all transactions
exports.getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
};

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { userId, userEmail, months } = req.body;

    // Validate months
    if (!months || months < PLAN_CONFIG.minMonths || months > PLAN_CONFIG.maxMonths) {
      return res.status(400).json({ 
        error: `Please select between ${PLAN_CONFIG.minMonths} to ${PLAN_CONFIG.maxMonths} months` 
      });
    }

    // Calculate amount (in paise for Razorpay)
    const amount = PLAN_CONFIG.finalPrice * months * 100;

    // Generate unique order ID
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: orderId,
      notes: {
        userId,
        userEmail,
        months,
        planName: 'Premium Plan'
      }
    });

    // Create transaction record
    const transaction = new Transaction({
      userId,
      userEmail,
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: amount / 100, // Store in rupees
      monthsPurchased: months,
      status: 'created',
      metadata: {
        planName: 'Premium Plan',
        pricePerMonth: PLAN_CONFIG.finalPrice
      }
    });

    await transaction.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      internalOrderId: orderId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Verify payment and create/extend subscription
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update transaction as failed
      await Transaction.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          status: 'failed',
          failureReason: 'Invalid signature'
        }
      );

      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Find transaction
    const transaction = await Transaction.findOne({ 
      razorpayOrderId: razorpay_order_id 
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction as successful
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.status = 'success';
    transaction.paymentMethod = payment.method;
    await transaction.save();

    // Find active subscription
    const activeSubscription = await Subscription.findOne({ 
      userId, 
      isActive: true 
    }).sort({ endDate: -1 });

    let startDate, endDate, purchaseType;

    if (activeSubscription && !activeSubscription.isExpired()) {
      // Extend existing subscription
      purchaseType = 'extension';
      startDate = activeSubscription.endDate;
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + transaction.monthsPurchased);
      
      // Update current subscription end date
      activeSubscription.endDate = endDate;
      await activeSubscription.save();
    } else {
      // Create new subscription
      purchaseType = 'new';
      startDate = new Date();
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + transaction.monthsPurchased);

      // Deactivate any previous subscriptions
      await Subscription.updateMany(
        { userId, isActive: true },
        { isActive: false }
      );
    }

    // Create subscription record
    const subscription = new Subscription({
      userId,
      planName: 'Premium Plan',
      monthsPurchased: transaction.monthsPurchased,
      startDate,
      endDate,
      isActive: true,
      amountPaid: transaction.amount,
      orderId: transaction.orderId,
      transactionId: razorpay_payment_id,
      purchaseType
    });

    await subscription.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      subscription: {
        ...subscription.toObject(),
        daysRemaining: subscription.getDaysRemaining()
      },
      transaction: transaction.toObject()
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    // Try to update transaction status
    if (req.body.razorpay_order_id) {
      await Transaction.findOneAndUpdate(
        { razorpayOrderId: req.body.razorpay_order_id },
        { 
          status: 'failed',
          failureReason: error.message
        }
      );
    }

    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// Handle payment failure
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { razorpay_order_id, error } = req.body;

    await Transaction.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        status: 'failed',
        failureReason: error?.description || 'Payment failed'
      }
    );

    res.json({ message: 'Payment failure recorded' });
  } catch (error) {
    console.error('Error handling payment failure:', error);
    res.status(500).json({ error: 'Failed to record payment failure' });
  }
};
