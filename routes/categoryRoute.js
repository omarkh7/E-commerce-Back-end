const express = require('express')
const CategoryController = require('../controllers/categoryController.js')
const upload = require('../middleware/uploadMiddleware.js');

const router = express.Router();

router.route("/allcategories").get(CategoryController.getAllCategories);
router.route("/getcategorybyid/:id").get(CategoryController.getCategory);
router.route("/createcategory").post(upload.single("image"),CategoryController.postCategory);
router.route("/updatecategory/:id").put(upload.single("image"),CategoryController.updateCategory);
router.route("/deletecategory/:id").delete(CategoryController.eraseCategory);



module.exports = router;