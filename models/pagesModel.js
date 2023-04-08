const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const pagesSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: { type: String
    
    },
});

const Pages = mongoose.model('Pages', pagesSchema);
module.exports = Pages;