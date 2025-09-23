const Order = require('../models/Order');
const Product = require('../models/Product');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'You must be logged in to perform this action' });
};

exports.createOrder = async (req, res) => {
  try {
    const { products, user } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    if (!user) {
      return res.status(400).json({ error: 'User email is required' });
    }

    // Calculate total price
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      const productDoc = await Product.findOne({ name: item.product });
      if (!productDoc) {
        return res.status(400).json({ error: `Product not found: ${item.product}` });
      }
      
      totalPrice += productDoc.price * item.quantity;
      orderProducts.push({
        product: item.product,
        quantity: item.quantity,
        price: productDoc.price
      });
    }

    const order = new Order({
      user: user,
      products: orderProducts,
      totalPrice: totalPrice,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ error: 'User email is required' });
    }
    
    const orders = await Order.find({ user: user });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to Delete the Order By Admin
exports.DeleteOrders = async (req, res, next) => {
 if(req.user.role !== 'admin') {
  return res.status(403).json({ error: 'You do not have admin privileges'});
 }
 next();

 const DeleteOrders = await Order.findByIdAndDelete(req.params.id);
 if(!DeleteOrders) {
  return res.status(404).json({ error: 'Order not found' });
 }
 res.status(200).json({ message: 'Order deleted successfully' });
}