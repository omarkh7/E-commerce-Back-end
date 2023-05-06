const Product = require("../models/productModel.js");
const Category = require("../models/categoryModel.js");
const mongoose = require("mongoose");
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// =============================IMPORTING=================================

// =============================GET PRODUCT=================================
const getProducts = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.status(200).json({ success: true, productList });
});

// =============================GET PRODUCT BY ID=================================
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({ product });
});

// =============================GET PRODUCT BY NAME================================
const getProductsByName = asyncHandler(async (req, res, next) => {
  const productName = req.params.name;
  const product = await Product.findOne({ name: productName }).populate(
    "category"
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

// =============================GET PRODUCT BY CATEGORY ID==============================
const getProductsByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId }).populate(
      "category"
    );
    console.log(products);
    res.status(200).json({
      products,
    });
  } catch (err) {
    next(err);
  }
};

// =============================GET PRODUCT BY CATEGORY NAME =================================
const getProductsByCategoryName = async (req, res, next) => {
  const { categoryName } = req.params;
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    const products = await Product.find({ category: category._id }).populate(
      "category"
    );
    console.log(products);
    res.status(200).json({
      products,
    });
  } catch (err) {
    next(err);
  }
};

// =============================CREATING PRODUCT=================================
const createProduct = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const image = req.files.image;

     
    const fileName = image[0].filename;
    const basePath = `${req.protocol}://${req.get("host")}/images`;
    console.log('req', req.body)
    console.log('req files', req.files.images)
    const Images = req.files.images.map(
      (file) => `${basePath}/${file.filename}`
    );


    const attribute = JSON.parse(req.body.attribute)
   
    const countInStock = attribute.reduce(
      (total, item) => total + item.quantity,
      0
    );
    
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      attribute: attribute,
      image: `${basePath}/${fileName}`,
      images: Images,
      category: req.body.category,
      countInStock: countInStock,
      price: req.body.price,
    });

    product = await product.save();

    if (!product) return res.status(500).send("The product cannot be created");

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    if (product.dateCreated >= twoDaysAgo) {
      product.is_new_release = true;
      await product.save();
    }


    res.send(product);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// =============================UPDATING PRODUCT=================================

const updateProduct = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");

  // Update the product object with the new values
  product.name = req.body.name;
  product.description = req.body.description;
  product.category = req.body.category;
  product.price = req.body.price;

  // Map over the attributes array and update each attribute with new values
  product.attribute = product.attribute.map((attribute, i) => {
    if (req.body.size[i] && req.body.color[i] && req.body.quantity[i]) {
      attribute.size = req.body.size[i];
      attribute.color = req.body.color[i];
      attribute.quantity = parseInt(req.body.quantity[i]);
    }
    return attribute;
  });

  // Calculate the total countInStock by summing up the quantity of each attribute
  const totalCount = product.attribute.reduce((total, attr) => {
    return total + attr.quantity;
  }, 0);

  product.countInStock = totalCount;

  // Update the images if there are new ones
  if (req.files && req.files.images) {
    product.image = req.files["images"][0].path;
    product.images = req.files["images"].map((image) => image.path);
  }

  const updatedProduct = await product.save();

  if (!updatedProduct)
    return res.status(500).send("the product cannot be updated!");

  res.send(updatedProduct);
};

// =============================DELETING PRODUCT=================================

const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// =============================MODULE EXPORT=================================
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductsByCategoryId,
  getProductsByCategoryName,
  getProductsByName,
};
