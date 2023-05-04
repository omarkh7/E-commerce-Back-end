const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  attribute: [
    {
      size: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],

  image: {
    type: String,
    default: "",
  },

  images: [
    {
      type: String,
    },
  ],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  countInStock: {
    type: Number,
    required: true,
    min: 0,
  },

  price: {
    type: Number,
    required: true,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
  is_new_release: {
    type: Boolean,
    default:false,
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
