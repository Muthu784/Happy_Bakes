const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const uploadMiddleware = require('../Middleware/upload');
const { configDotenv } = require('dotenv');
const cloudinary = require('cloudinary').v2; // Import Cloudinary

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name, // Replace with your Cloudinary cloud name
  api_key: process.env.api_key,       // Replace with your Cloudinary API key
  api_secret: process.env.api_secret   // Replace with your Cloudinary API secret
});

// Create a new product
router.post('/', async (req, res) => {
  const { name, price, description, image } = req.body;
  try {

    const product = new Product({ name, price, description, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error occurred while processing the request:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description, image},
      { new: true }
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product with image upload
router.post("/createProducts", uploadMiddleware.single('image'), async (req, res) => {
  const { pname, price, description } = req.body;
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path); // Upload the file to Cloudinary

    const product = await Product.create({
      name: pname,
      price,
      description,
      image: result.secure_url // Save the Cloudinary URL
    });

    res.status(200).json({
      status: true,
      product
    });
  } catch (error) {
    console.log("error ---> ", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
});

module.exports = router;