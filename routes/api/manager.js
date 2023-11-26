const express = require("express");
const _ = express.Router();
const {
  addProduct,
  getAllProduct,
  getSigleProduct,
  updateProduct,
  deleteProduct,
} = require("../../controller/ProductController");
const upload = require("../../middleware/uploadImage");
const verifiToken = require("../../middleware/verifiToken");
_.get("/get-all-product", verifiToken, getAllProduct);
_.get("/get-single-product", verifiToken, getSigleProduct);
_.put(
  "/get-single-product/:id",
  upload.single("product_image"),
  verifiToken,
  updateProduct
);
_.post("/add-product", upload.single("product_image"), verifiToken, addProduct);
_.delete("/delete-product/:id", verifiToken, deleteProduct);
module.exports = _;
