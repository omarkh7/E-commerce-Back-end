const express = require('express')
const CategoryController = require('../controllers/categoryController.js')

const router = express.Router();

router.route("/allcategories").get(CategoryController.getAllCategories);
router.route("/getcategorybyid/:id").get(CategoryController.getCategory);
router.route("/createcategory").post(CategoryController.postCategory);
router.route("/updatecategory/:id").put(CategoryController.updateCategory);
router.route("/deletecategory/:id").delete(CategoryController.eraseCategory);



module.exports = router;