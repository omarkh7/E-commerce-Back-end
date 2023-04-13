const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // product_id: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Product'
    // }
    
    // ]

});
// categorySchema.virtual('product', {
//     ref: 'Product',
//     localField: 'product_id',
//     foreignField: '_id'
//   });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
