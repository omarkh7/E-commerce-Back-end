const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    attribute: [{
        size: Number,
        color: String
    }],
    feature_image: {
        type: String,
        required: true
    },
    group_images: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    wishlist: { },
    category_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
    ]

});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;