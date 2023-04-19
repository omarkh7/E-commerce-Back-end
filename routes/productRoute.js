const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware.js");
    const {isAuthenticated} = require("../middleware/userAuthMiddleware");

const {
  getProducts,
  getProductById,
  getProductsByCategoryId,
  getProductsByCategoryName,
  getProductsByName,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/getproducts",isAuthenticated, getProducts);
router.get("/getproductbyid/:id", getProductById);
router.get("/getproductsbycategory/:categoryId", getProductsByCategoryId);
router.get(
  "/getproductsbycategoryname/:categoryName",
  getProductsByCategoryName
);
router.get("/getproductsbyname/:name", getProductsByName);
router.post("/createproduct", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), createProduct);
router.put("/updateproduct/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);

module.exports = router;
