const express = require('express')
const CategoryController = require('../controllers/categoryController.js')

const router = express.Router();

router.route("/").get(CategoryController.getAllCategories);
router.route("/:id").get(CategoryController.getCategory);
router.route("/").post(CategoryController.postCategory);
router.route("/:id").put(CategoryController.updateCategory);
router.route("/:id").delete(CategoryController.eraseCategory);



module.exports = router;