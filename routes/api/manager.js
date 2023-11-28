const express = require("express");
const _ = express.Router();
const {
  addProduct,
  getAllProduct,
  getSigleProduct,
  updateProduct,
  deleteProduct,
  addTocheckOut,
  getCheckOutProduct,
  addInvoice,
} = require("../../controller/ProductController");
const upload = require("../../middleware/uploadImage");
const verifiToken = require("../../middleware/verifiToken");
const {
  paymentStripe,
  payments,
} = require("../../controller/PaymentController");

// routes for Product manage
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

// check out route
_.get("/get-checkout", verifiToken, getCheckOutProduct);
_.post("/add-to-checkout", verifiToken, addTocheckOut);

// Invoice or get paid
_.post("/invoice", verifiToken, addInvoice);

//Payment intent
// payment intent
_.post("/create-payment-intent", paymentStripe);
_.post("/payments", payments);

module.exports = _;
