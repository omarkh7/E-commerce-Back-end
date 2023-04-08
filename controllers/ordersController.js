const Order = require('../models/ordersModel')
const asyncHandler = require('express-async-handler')



//****Create new Order****//
exports.newOrder = asyncHandler(async (req, res, next) => {
    try {
        const {user_id,
            status,
            payment_status,
            cart,
            total_price,
            } = req.body;

        const order = await Order.create({
            user_id,
            status,
            payment_status,
            cart,
            total_price,  
       
        });

        res.status(200).json({ succes: true, order })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }

});




//***Get order by id***//
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) return res.json({ message: "Not an order" })

        res.status(200).json({ succes: true, order })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});




//****Find all orders with authorized admin*****/
exports.getAllOrders = asyncHandler(async (req, res, next) => {

    try {
        const orders = await Order.find()

        if (!orders) return res.json({ message: "No orders" })

        res.status(200).json({ succes: true, orders })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});



//****Delete order by Id ****//
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



//****Update Order ****//
exports.updateOrder = asyncHandler(async (req, res, next) => {
    
    const order = await Order.findById(req.params.id)
    
    if (!order) return res.json({ message: "No order" })

    if (order.status == false ) {
        return res.json({ message: "Order is cancelled" })
    }
    else if (order.payment_status == true) {
        return res.json({ message: "Order is paid" })
    }
    else if (order.status == true || order.payment_status == false) {
        
        order.cart.forEach(async (element) => {
            await updateStock(element.quantity,element.price)
            
        });
    }

})
