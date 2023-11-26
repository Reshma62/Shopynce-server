const express = require("express");
const _ = express.Router();
const {
  addProduct,
  getAllProduct,
  getSigleProduct,
} = require("../../controller/ProductController");
const upload = require("../../middleware/uploadImage");
const verifiToken = require("../../middleware/verifiToken");
_.get("/get-all-product", verifiToken, getAllProduct);
_.get("/get-single-product/:id", verifiToken, getSigleProduct);
_.put("/get-single-product/:id", verifiToken, getSigleProduct);
_.post("/add-product", upload.single("product_image"), verifiToken, addProduct);
module.exports = _;
