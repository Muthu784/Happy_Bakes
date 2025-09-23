const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../Middleware/authMiddleware');
const adminController = require('../Controllers/Admincontroller');

// Apply authentication middleware to all admin routes
router.use(authenticate);
router.use(isAdmin);

// Log all admin route access
router.use((req, res, next) => {
  console.log(`Admin route accessed by user: ${req.user?.email} (${req.user?.role})`);
  next();
});

// Order management routes
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Product management routes
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

module.exports = router;