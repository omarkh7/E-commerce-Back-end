const express = require('express');
const { newOrder,
    getSingleOrder,
    getAllOrders,
    deleteOrder} = require('../controllers/ordersController');

const router = express.Router();

router.route('/orders').post(newOrder)
router.route('/order/:id').get(getSingleOrder)
router.route('/authorized/orders').get(getAllOrders)
router.route('/authorized/orders/:id').delete(deleteOrder)

module.exports = router;