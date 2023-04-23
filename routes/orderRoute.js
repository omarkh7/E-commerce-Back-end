const express = require('express');
const { newOrder,
    getSingleOrder,
    getAllOrders,
    deleteOrder,
    updateOrderCart } = require('../controllers/ordersController');

const { isAuthenticated} = require('../middleware/userAuthMiddleware');
const router = express.Router();

router.route('/orders').post(isAuthenticated,newOrder)
router.route('/order/:id').get(getSingleOrder)
router.route('/authorized/orders').get(getAllOrders)
router.route('/authorized/orders/:id').delete(deleteOrder).put(updateOrderCart)

module.exports = router;