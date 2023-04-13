const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel.js");
const Category = require("../models/categoryModel.js");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create a new product
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      attribute,
      price,
      quantity,
      wishlist,
      category_id,
    } = req.body;

    // Upload feature image to Cloudinary
    const feature_image = await cloudinary.uploader.upload(req.file.path);

    // Upload group images to Cloudinary if provided
    let group_images;
    if (req.files) {
      const results = await Promise.all(
        req.files.map((file) => cloudinary.uploader.upload(file.path))
      );
      group_images = results.map((result) => result.secure_url);
    }

    const product = new Product({
      name,
      description,
      attribute,
      feature_image: feature_image.secure_url,
      group_images,
      status: false,
      price,
      quantity,
      wishlist,
      category_id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

// Update a product
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      attribute,
      price,
      quantity,
      wishlist,
      category_id,
    } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    // Upload new feature image to Cloudinary if provided
    if (req.file) {
      const feature_image = await cloudinary.uploader.upload(req.file.path);
      product.feature_image = feature_image.secure_url;
    }

    // Upload new group images to Cloudinary if provided
    if (req.files) {
      const results = await Promise.all(
        req.files.map((file) => cloudinary.uploader.upload(file.path))
      );
      product.group_images = results.map((result) => result.secure_url);
    }

    product.name = name;
    product.description = description;
    product.attribute = attribute;
    product.price = price;
    product.quantity = quantity;
    product.wishlist = wishlist;
    product.category_id = category_id;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a product
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category_id");

    res.status(200).json({
      products,
    });
  } catch (err) {
    next(err);
  }
};

// Get a product by ID
const getProductById = async (req, res, next) => {
  let{id} = req.params;
  try {

    const product = await Product.findOne({_id:id}).populate("category_id");

    res.status(200).json({
      product,
    });
  } catch (err) {
    next(err);
  }
};


// Get all products by category
const getProductsByCategory = async (req, res, next) => {
  let{category_Id} = req.params;
  try {
    const products = await Product.find({ category_id: category_Id });

    res.status(200).json({
      products,
    });
  } catch (err) {
    next(err);
  }
};



// Get all products by name
const getProductsByName = async (req, res, next) => {
  try {
    const name = req.query.name;
    const products = await Product.find({ name: new RegExp(name, "i") });

    res.status(200).json({
      products,
    });
  } catch (err) {
    next(err);
  }
};

// Add a product to the wishlist
const addProductToWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;
    const userId = req.user.id; // assuming that the user ID is stored in the req.user object
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if the product already exists in the user's wishlist
    const existingProductIndex = req.user.wishlist.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // If the product already exists, update the quantity
      req.user.wishlist[existingProductIndex].quantity += quantity;
    } else {
      // If the product doesn't exist, add it to the wishlist
      req.user.wishlist.push({
        productId,
        quantity,
      });
    }

    await req.user.save();

    res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist: req.user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

// Remove a product from the wishlist
const removeProductFromWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id; // assuming that the user ID is stored in the req.user object
    // Find the index of the product in the wishlist
    const productIndex = req.user.wishlist.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in wishlist",
      });
    }

    // Remove the product from the wishlist
    req.user.wishlist.splice(productIndex, 1);

    await req.user.save();

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: req.user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByName,
  addProductToWishlist,
  removeProductFromWishlist,
};
