const Order = require('../models/ordersModel')
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./test');




//************************Create new Order******************************//
///********/
exports.newOrder = asyncHandler(async (req, res, next) => {

    try {
        const {  cart, } = req.body;
      
        const orderItems = [];

        if (!cart) {
            return res.status(400).json({ error: 'Cart is not defined' });
        }

       
        for (let i = 0; i < cart.length; i++) {
            const product = await Product.findById(cart[i].product_id);
            const quantity = cart[i].quantity;

            const productAttribute = product.attribute.find((attribute) => {
                
                return attribute.size ==cart[i].size && attribute.color == cart[i].color
            });
            
            if (!productAttribute) {
                return res.status(400).json(
                    {
                        error: `The requested attribute of ${product.name} is not available`
                    })
            }

            if (productAttribute.quantity < quantity) {
                return res.status(400).json(
                    {
                        error: `The requested quantity of ${product.name} is not available`
                    })
            }

        
            productAttribute.quantity -= quantity;

            await product.save();

            orderItems.push(
                {product_id: product._id,size: productAttribute.size,  color: productAttribute.color,quantity: quantity, price: product.price ,name:product.name,image:product.image}
            );
        }

        const total_price = cart.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const order = await Order.create({
            user_id: req.user,
            cart: orderItems,
            total_price
        });

        res.status(200).json({ success: 'Order is created', order });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});




//***************************** Get order by id *************************//
///*******/
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('cart.product_id').populate('user_id');

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
        const orders = await Order.find().populate('cart.product_id').populate('user_id');

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
    // const cart = req.body.cart;
    const status = req.body.status;
    const payment_status = req.body.payment_status;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    // const orderItems = [];

    
    // for (let i = 0; i < cart.length; i++) {
    //     const product = await Product.findById(cart[i].product_id);

    //     const productAttribute = product.attribute.find((attribute) => {
    //         return attribute.size == cart[i].size && attribute.color == cart[i].color;
    //     });

    //     if (!productAttribute) {
    //         return res.status(400).json({
    //             error: `The requested attribute of ${product.name} is not available`
    //         });
    //     }

    //     if (productAttribute.quantity < cart[i].quantity) {
    //         return res.status(400).json({
    //             error: `The requested quantity of ${product.name} is not available`
    //         });
    //     }

    //     productAttribute.quantity -= cart[i].quantity;
    //     await product.save();

    //     orderItems.push({
    //         product_id: product._id,
    //         size: cart[i].size,
    //         color: cart[i].color,
    //         quantity: cart[i].quantity,
    //         price: product.price,
    //     });
    // }

    // const total_price = orderItems.reduce((total, item) => {
    //     return total + item.price * item.quantity;
    // }, 0);

    // order.total_price = total_price;
    // order.cart = orderItems;
    order.status = status;
    order.payment_status = payment_status;

    const updatedOrder = await order.save();

    // Populate the cart.product_id field in the updated order object
    await Order.findById(updatedOrder._id).populate('cart.product_id');

    res.status(200).json({ message: "Order updated", order: updatedOrder });
});




////**********Add to cart  */

///
exports.addToCart = asyncHandler(async (req, res, next) => {
    const products = req.body.products;

    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    for (let i = 0; i < products.length; i++) {
        // const { productId, size, color, quantity } = products[i];
        const product = await Product.findById(products[i].product_id);


        if (!product) {
            return res.status(404).json({ error: `Product with id ${products[i].product_id} not found` });
        }


        const productAttribute = product.attribute.find(
            (attribute) => attribute.size == products[i].size && attribute.color == products[i].color
        );


        if (!productAttribute) {
            return res
                .status(400)
                .json({ error: `The requested attribute of ${product.name} is not available` });
        }

        if (productAttribute.quantity < products[i].quantity) {
            return res
                .status(400)
                .json({ error: `The requested quantity of ${product.name} is not available` });
        }

        const existingItem = cart.findIndex(
            (item) => item.productId == products[i].product_id &&
                item.size == products[i].size &&
                item.color == products[i].color
        );

        if (existingItem !==-1) {
            cart[existingItem].quantity += products[i].quantity;
        } else {
            cart.push({
                productId: products[i].product_id,
                size: products[i].size,
                color: products[i].color,
                quantity: products[i].quantity,
                price: productAttribute.price,
                name: product.name,
                image: product.image,
            });
        }
    }

    // Save the updated cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(localStorage.getItem('cart'))

    // const cart1 = JSON.parse(localStorage.getItem('cart'));

    // console.log(cart1);

    res.status(200).json({ message: "Products added to cart successfully", cart });
});


///in the body i should specify {size:,color} and in the path the index
exports.removeFromCart = asyncHandler(async (req, res, next) => {
    const productId = req.params.id;
    const { size, color } = req.body;

    // Get the cart from local storage
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    // Find the index of the item to remove
    const index = cart.findIndex(
        (item) => item.productId === productId && item.size === size && item.color === color
    );

    if (index !== 0) {
        // Remove the item from the cart
        cart.splice(index, 1);

        // Save the updated cart in local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        res.status(200).json({ message: "Product removed from cart successfully", cart });

    } else {
        // If the item is not found in the cart, return an error
        res.status(404).json({ error: "Product not found in cart" });
    }
});



