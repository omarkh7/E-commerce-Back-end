const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    user_id: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    status: {
        type: Boolean,
        default: false
    },
    payment_status: {
        type: Boolean,
        default: false
    },
    cart: [{
        product_id: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        ], quantity: {
            type: Number
        }, price: {
            type: Number
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

const Product = mongoose.model('Product', productSchema);
module.exports = Product;