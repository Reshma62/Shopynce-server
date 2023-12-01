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
  getAllSoldCount,
} = require("../../controller/ProductController");
const {
  paymentStripe,
  payments,
} = require("../../controller/PaymentController");

// routes for Product manage
_.get("/get-all-product", getAllProduct);
_.get("/get-single-product", getSigleProduct);
_.put(
  "/get-single-product/:id",

  updateProduct
);
_.post("/add-product", addProduct);
_.delete("/delete-product/:id", deleteProduct);

// check out route
_.get("/get-cart-items", getCartItems);
_.post("/add-to-cart", addToCart);

// Invoice or sale products
_.get("/get-sold-products/:email", getSoldProducts);
_.post("/sold-products", addSoldProducts);
_.get("/sold-products", soldProducts);
_.get("/sold-count", getAllSoldCount);

// _.get("/sold-products-all", getSoldProductsDetails);
_.get("/calculate-totals/:email", calculateTotal);

//Payment intent
_.post("/create-payment-intent", paymentStripe);
_.post("/payments", payments);

module.exports = _;
