const Order = require('../models/ordersModel')
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');




//************************Create new Order******************************//
///********/
exports.newOrder = asyncHandler(async (req, res, next) => {

    try {
        const {
            status,
            payment_status,
            cart,
        } = req.body;

        const orderItems = [];

        console.log(cart)

        if (!cart ) {
            return res.status(400).json({ error: 'Cart is not defined' });
        }
        //loop in the cart to check the quantity available of each product 
        for (let i = 0; i < cart.length; i++) {
            const product = await Product.findById(cart[i].product_id)

            if (product.quantity < cart[i].quantity) {
                return res.status(400).json({ error: `The requested quantity ${product.name} is not available` })
            }

            //Decrease the quantity of product 
            product.quantity -= cart[i].quantity;
            await product.save();


            orderItems.push({
                product_id: product._id,
                price: product.price,
                quantity: cart[i].quantity
            });

        }

        //Calculate the total price of each order
        const total_price = cart.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const order = await Order.create({
            user_id: req.user,
            status,
            payment_status,
            cart: orderItems,
            total_price,

        });

        res.status(200).json({ success: 'Order is created', order })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }

});



//***************************** Get order by id *************************//
///*******/
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('cart.product_id');

        if (!order) return res.json({ message: "Not an order" })


        res.status(200).json({ success: true, order })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});




//********************** Find all orders with authorized admin **********************//
///********/
exports.getAllOrders = asyncHandler(async (req, res, next) => {

    try {
        const orders = await Order.find().populate('cart.product_id');

        if (!orders) return res.json({ message: "No orders" })

        res.status(200).json({ success: true, orders })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});



//******************************** Delete order by Id ********************************//
///********//
exports.deleteOrder = asyncHandler(async (req, res, next) => {

    try {
        const order = await Order.findByIdAndRemove(req.params.id)

        if (!order) return res.json({ message: "No order" })

        res.status(200).json('Order is deleted')
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
})



//*********************************Update order by id***********************************///
///********/
exports.updateOrderCart = asyncHandler(async (req, res, next) => {

    const cart = req.body.cart;
    const status = req.body.status;
    const payment_status = req.body.payment_status;

    const order = await Order.findById(req.params.id);


    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const orderItems = [];

    //loop in the cart to check the quantity available of each product 
    for (let i = 0; i < cart.length; i++) {
        const product = await Product.findById(cart[i].product_id)

        if (product.quantity < cart[i].quantity) {
            return res.status(400).json({ error: `The requested quantity ${product.name} is not available` })
        }

        //Decrease the quantity of product 
        product.quantity -= cart[i].quantity;
        await product.save();


        orderItems.push({
            product_id: product._id,
            price: product.price,
            quantity: cart[i].quantity
        });

    }

    const total_price = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);


    order.total_price = total_price;
    order.cart = cart;;
    order.status = status;
    order.payment_status = payment_status;


    const updatedOrder = await order.save();


    // Populate the cart.product_id field in the updated order object
    await Order.findById(updatedOrder._id).populate('cart.product_id');

    res.status(200).json({ message: "Order updated", order: updatedOrder });
});





