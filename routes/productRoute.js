const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByName,
  createProduct,
  addProductToWishlist,
  updateProduct,
  deleteProduct,
  removeProductFromWishlist,
} = require("../controllers/productController");



router.get("/getproducts", getProducts);
router.get("/getproductbyid/:id", getProductById);
router.get("/getproductsbycategory/:id", getProductsByCategory);
router.get("/getproductsbyname/", getProductsByName);
router.post("/createproduct", createProduct);
router.post("/addproducttowishlist", addProductToWishlist);
router.put("/updateproduct/:id", updateProduct);
router.delete("/deleteproduct:/id", deleteProduct);
router.delete("/removeproductfromwishlist", removeProductFromWishlist);

module.exports = router;
