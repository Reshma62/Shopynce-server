const express = require("express");
const _ = express.Router();
const {
  addProduct,
  getAllProduct,
  getSigleProduct,
  updateProduct,
  deleteProduct,
  soldProducts,

  getCartItems,
  addSoldProducts,
  getSoldProducts,
  calculateTotal,
  addToCart,
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
_.get("/get-cart-items", verifiToken, getCartItems);
_.post("/add-to-cart", verifiToken, addToCart);

// Invoice or sale products
_.get("/get-sold-products/:email", verifiToken, getSoldProducts);
_.post("/sold-products", verifiToken, addSoldProducts);
_.get("/sold-products", soldProducts);

// _.get("/sold-products-all", getSoldProductsDetails);
_.get("/calculate-totals/:email", calculateTotal);

//Payment intent
_.post("/create-payment-intent", paymentStripe);
_.post("/payments", payments);

module.exports = _;
