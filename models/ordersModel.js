const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const orderSchema = new Schema({
    user_id: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ,
    status: {
        type: Boolean,
        default: false
    },
    payment_status: {
        type: Boolean,
        default: false
    },
    cart: [{
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        size: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        price: {
            type: Number,
            required: true
        }
    }],
    total_price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;