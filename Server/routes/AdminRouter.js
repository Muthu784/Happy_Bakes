const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const AdminController = require('../Controllers/Admincontroller');

// Get the Placed Order by Users
router.get('/orders', authenticate, isAdmin, AdminController.getAllOrders);

// Update order status
router.put('/orders/:orderId', authenticate, isAdmin, AdminController.updateOrderStatus);

// Create a new product (Admin only)
router.post('/products', authenticate, isAdmin, async (req, res) => {
  const { name, price, description, image } = req.body;
  try {
    const product = new Product({ name, price, description, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product (Admin only)
router.put('/products/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description, image },
      { new: true }
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product (Admin only)
router.delete('/products/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;