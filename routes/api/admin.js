const express = require("express");
const _ = express.Router();
const {
  getAllProducts,
  getAdminInfo,
  getAllUser,
  sendEmailPromotion,
} = require("../../controller/AdminController");
const { verifiAdmin } = require("../../middleware/verifiAdmin");
const verifiToken = require("../../middleware/verifiToken");
_.get("/products", verifiToken, verifiAdmin, getAllProducts);
_.get("/admin-info", verifiToken, verifiAdmin, getAdminInfo);
_.get("/all-user-info", verifiToken, getAllUser);
_.post("/send-promotion", verifiToken, verifiAdmin, sendEmailPromotion);
module.exports = _;
