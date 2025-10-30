require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const cookieParser = require('cookie-parser');
const ConnectDB = require('../Server/Config/db');
const AuthRouter = require('../Server/routes/AuthRouter');
const orderRoutes = require('../Server/routes/OrderRouter');
const adminRoutes = require('../Server/routes/AdminRouter');

const fs = require('fs');

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});



// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', require('../Server/routes/ProductRouter'));

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images"))
  },
  filename: (req, file, filename, cb) => {
    cb(null, file.filename + Date.now() + file.originalname)
  }
});

const upload = multer({storage: Storage});

// Export the upload middleware
module.exports.upload = upload;

app.post('/images', upload.single("photo"),(req,res)=>{
  res.send("Uploaded")
})

app.get('/',(req, res)=>{
  res.send('Node Api Working')
})

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
