const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Tariff = require('../models/Tariff');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create payment intent for subscription
router.post('/create-subscription-payment', authMiddleware, [
  body('tariffId').notEmpty().withMessage('Tariff ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tariffId } = req.body;
    const tariff = await Tariff.findById(tariffId);

    if (!tariff) {
      return res.status(404).json({ error: 'Tariff not found' });
    }

    const user = await User.findById(req.userId);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(tariff.price * 100), // converting to cents
      currency: 'usd',
      metadata: {
        userId: user._id.toString(),
        tariffId: tariff._id.toString(),
        type: 'subscription'
      }
    });

    // Create transaction record
    const transaction = new Transaction({
      user: user._id,
      type: 'subscription',
      amount: tariff.price,
      currency: 'USD',
      status: 'pending',
      paymentMethod: 'card',
      description: `Subscription payment for ${tariff.name} plan`,
      relatedEntity: {
        type: 'tariff',
        id: tariff._id
      },
      metadata: {
        stripePaymentIntentId: paymentIntent.id
      }
    });

    await transaction.save();

    res.send({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Confirm subscription payment
router.post('/confirm-subscription', authMiddleware, [
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('paymentIntentId').notEmpty().withMessage('Payment Intent ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { transactionId, paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not succeeded' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction status
    transaction.status = 'completed';
    transaction.paymentDetails = {
      transactionId: paymentIntent.id,
      cardLast4: paymentIntent.charges.data[0].payment_method_details.card.last4
    };
    await transaction.save();

    // Update user subscription
    const tariff = await Tariff.findById(transaction.relatedEntity.id);
    const user = await User.findById(req.userId);

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + (tariff.period === 'year' ? 12 : 1));

    user.subscription = {
      plan: tariff.level,
      expiryDate,
      autoRenew: true
    };

    await user.save();

    res.json({
      message: 'Subscription activated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Confirm subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const filter = { user: req.userId };

    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .populate('relatedEntity.id')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;