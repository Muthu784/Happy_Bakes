const express = require('express');
const router = express.Router();
const OrderController = require('../Controllers/OrderController');


router.post('/createOrder', OrderController.createOrder);
router.get('/getUserOrder', OrderController.getUserOrders);

module.exports = router;