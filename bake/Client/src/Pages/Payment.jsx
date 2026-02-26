import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Shield, Sparkles, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import '../Styles/Payment.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { theme } = useContext(ThemeContext);
  const amountFromOrder = location.state?.totalAmount;
  const orderItems = location.state?.orderItems;

  const [amount, setAmount] = useState(amountFromOrder ? amountFromOrder * 100 : 10000); // paise, default ₹100
  const [status, setStatus] = useState('idle'); // idle | loading | success | failed
  const [message, setMessage] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setScriptLoaded);
  }, []);

  const openRazorpayCheckout = useCallback(async () => {
    const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!keyId) {
      setStatus('failed');
      setMessage('Razorpay key not configured. Add REACT_APP_RAZORPAY_KEY_ID in .env');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: 'receipt_' + Date.now(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.orderId) {
        setStatus('failed');
        setMessage(data.message || 'Could not create order. Ensure backend payment API is set up.');
        return;
      }

      const options = {
        key: keyId,
        order_id: data.orderId,
        amount: data.amount || amount,
        currency: data.currency || 'INR',
        name: 'Happy Bakes',
        description: orderItems ? `Order: ${orderItems.length} item(s)` : 'Payment for Happy Bakes',
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#e91e63' },
        handler: function (res) {
          setStatus('success');
          setMessage(`Payment ID: ${res.razorpay_payment_id}`);
          // Optional: verify payment on backend
          fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            }),
          }).catch(() => {});
        },
        modal: { ondismiss: () => setStatus('idle') },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setStatus('failed');
        setMessage('Payment failed or was cancelled.');
      });
      rzp.open();
    } catch (err) {
      setStatus('failed');
      setMessage(err.message || 'Network error. Check backend and try again.');
    }
  }, [amount, user, orderItems]);

  const amountInRupees = amount / 100;
  const isDark = theme === 'dark';

  return (
    <div className={`payment-page ${isDark ? 'payment-page--dark' : ''}`}>
      <div className="payment-bg-shapes">
        <span className="payment-shape payment-shape--1" />
        <span className="payment-shape payment-shape--2" />
        <span className="payment-shape payment-shape--3" />
      </div>

      <motion.div
        className="payment-container"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.header
          className="payment-header"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <motion.span
            className="payment-header-icon"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <CreditCard size={32} />
          </motion.span>
          <h1>Secure Payment</h1>
          <p>Pay securely with Razorpay</p>
        </motion.header>

        <motion.section
          className="payment-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <div className="payment-card-glow" />
          <div className="payment-amount-block">
            <span className="payment-amount-label">Amount</span>
            <motion.span
              className="payment-amount-value"
              key={amountInRupees}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              ₹ {amountInRupees.toFixed(2)}
            </motion.span>
            {!amountFromOrder && (
              <div className="payment-amount-input-wrap">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amountInRupees}
                  onChange={(e) => setAmount(Math.round(Number(e.target.value) * 100))}
                  className="payment-amount-input"
                />
                <span className="payment-amount-suffix">₹</span>
              </div>
            )}
          </div>

          <ul className="payment-features">
            {['SSL encrypted', 'Instant confirmation', 'Refund policy'].map((text, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
              >
                <Shield size={16} /> {text}
              </motion.li>
            ))}
          </ul>

          <motion.button
            type="button"
            className="payment-btn"
            onClick={openRazorpayCheckout}
            disabled={status === 'loading' || !scriptLoaded}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={22} className="payment-btn-spinner" />
                Opening checkout…
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Pay with Razorpay
              </>
            )}
          </motion.button>
        </motion.section>

        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.div
              className="payment-status payment-status--success"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <CheckCircle2 size={48} />
              <h3>Payment Successful</h3>
              <p>{message || 'Thank you for your order!'}</p>
              <motion.button
                type="button"
                className="payment-btn payment-btn--secondary"
                onClick={() => { setStatus('idle'); navigate('/userorder'); }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Orders
              </motion.button>
            </motion.div>
          )}
          {status === 'failed' && (
            <motion.div
              className="payment-status payment-status--failed"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <XCircle size={48} />
              <h3>Payment Failed</h3>
              <p>{message}</p>
              <motion.button
                type="button"
                className="payment-btn payment-btn--secondary"
                onClick={() => setStatus('idle')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          className="payment-back"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          ← Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Payment;
