const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    // Check if user is authenticated and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized: Admin access required' });
    }

    const orders = await Order.find()
      .populate('user')
      .populate('products.product')
      .sort({ createdAt: -1 }); // Show newest orders first
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};