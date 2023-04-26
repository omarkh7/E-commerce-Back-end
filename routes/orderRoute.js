const express = require('express');
const { newOrder,
    getSingleOrder,
    getAllOrders,
    deleteOrder,
    updateOrderCart,
    addToCart,
removeFromCart} = require('../controllers/ordersController');

const { isAuthenticated} = require('../middleware/userAuthMiddleware');
const router = express.Router();

router.route('/orders').post(isAuthenticated,newOrder)
router.route('/order/:id').get(isAuthenticated,getSingleOrder)
router.route('/authorized/orders').get(isAuthenticated,getAllOrders)
router.route('/authorized/orders/:id').delete(isAuthenticated, deleteOrder).put(isAuthenticated,updateOrderCart)
router.route('/cart').post(addToCart);
router.route('/cart/:id').delete(removeFromCart);
module.exports = router;