const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    console.log('Fetching all orders for admin');
    const orders = await Order.find({}).populate('user', 'email name');
    console.log(`Found ${orders.length} orders`);
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error in getAllOrders:', err);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    console.log(`Updating order ${id} status to ${status}`);
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      console.log(`Order ${id} not found`);
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`Order ${id} status updated to ${status}`);
    res.status(200).json(order);
  } catch (err) {
    console.error('Error in updateOrderStatus:', err);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    console.log('Creating new product:', { name, price });
    
    const product = new Product({ 
      name, 
      price, 
      description, 
      image 
    });
    
    await product.save();
    console.log(`Product created: ${product._id}`);
    res.status(201).json(product);
  } catch (err) {
    console.error('Error in createProduct:', err);
    res.status(500).json({ 
      error: 'Failed to create product',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image } = req.body;
    
    console.log(`Updating product ${id}`);
    
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description, image },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      console.log(`Product ${id} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`Product ${id} updated`);
    res.status(200).json(product);
  } catch (err) {
    console.error('Error in updateProduct:', err);
    res.status(500).json({ 
      error: 'Failed to update product',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting product ${id}`);
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      console.log(`Product ${id} not found for deletion`);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`Product ${id} deleted`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    res.status(500).json({ 
      error: 'Failed to delete product',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};