const express = require("express");
const _ = express.Router();
const {
  getAllProducts,
  getAdminInfo,
  getAllUser,
  sendEmailPromotion,
  getAllShop,
  sendNotice,
  getAllProductsSellingAmount,
  getAllUserCount,
} = require("../../controller/AdminController");
_.get("/products", getAllProducts);
_.get("/all-products-sell", getAllProductsSellingAmount);
_.get("/admin-info", getAdminInfo);
_.get("/all-user-info", getAllUser);
_.post("/send-promotion", sendEmailPromotion);
_.post("/send-notice", sendNotice);
_.get("/all-shop", getAllShop);
_.get("/user-count", getAllUserCount);
module.exports = _;
