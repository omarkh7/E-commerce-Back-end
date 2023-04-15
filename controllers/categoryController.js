const Category = require("../models/categoryModel.js");
const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");
//   =====================IMPORTING===============================

//   =====================GET ALL CATEGORY ===============================
const getAllCategories = asyncHandler(async (req, res) => {
  const all_Categories = await Category.find();
  res.status(200).json({
    message: "getting all Categories",
    status: 200,
    data: all_Categories,
  });
});

//   =====================GET CATEGORY ID===============================
const getCategory = asyncHandler(async (req, res) => {
  const get_Category = await Category.findById(req.params.id);

  if (!get_Category) {
    return res.status(400).send({ error: "Unable to find ID" });
  }

  res.status(200).json({
    message: "getting a specific Category",
    status: 200,
    data: get_Category,
  });
});

//   =====================CREATE CATEGORY===============================
const postCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: "Please provide a category name", status: 400 });
  }

  const newCategory = await Category.create({ name });

  res.status(201).json({
    message: "Category created successfully",
    status: 201,
    data: newCategory,
  });
});

//   =====================UPDATING CATEGORY===============================
const updateCategory = asyncHandler(async (req, res) => {
  const CategoryId = req.params.id;
  const update = await Category.findById(CategoryId);

  if (!update) {
    return res.status(400).json({ error: "unable to find id" });
  }

  const newUpdate = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    message: "Updated a specific Category",
    status: 200,
    data: newUpdate,
  });
});

//   =====================DELETE CATEGORY===============================
const eraseCategory = asyncHandler(async (req, res) => {
  const erasee = req.params.id;
  const erased = await Category.findByIdAndDelete(erasee);

  if (!erased) {
    return res.status(400).json({ message: "Couldn't Delete" });
  }
  const erase = await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Deleted a specific Category",
    status: 200,
    data: erase,
  });
});

module.exports = {
  getAllCategories,
  getCategory,
  postCategory,
  updateCategory,
  eraseCategory,
};
