const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

// Helper to create Razorpay instance using test keys from .env
const createRazorpayInstance = () => {
  const key_id = process.env.Test_Api_key;
  const key_secret = process.env.Test_Secret_key;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys not configured. Please set Test_Api_key and Test_Secret_key in .env');
  }

  return new Razorpay({ key_id, key_secret });
};

// POST /api/payment/create-order
// Expects: { amount: number (in paise), currency: string, receipt: string }
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount is required and must be greater than 0.' });
    }

    const razorpay = createRazorpayInstance();

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.Test_Api_key, // send publishable key to the client
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      message: 'Failed to create Razorpay order.',
      error: error.message || 'Unknown error',
    });
  }
});

// POST /api/payment/verify
// Expects: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification parameters.' });
    }

    const key_secret = process.env.Test_Secret_key;
    if (!key_secret) {
      return res.status(500).json({ message: 'Razorpay secret key not configured.' });
    }

    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    // At this point you can mark the order as paid in your DB
    return res.status(200).json({ message: 'Payment verified successfully.', success: true });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      message: 'Failed to verify Razorpay payment.',
      error: error.message || 'Unknown error',
    });
  }
});

module.exports = router;

