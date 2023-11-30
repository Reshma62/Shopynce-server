const express = require("express");
const _ = express.Router();
const {
  createUser,
  createOwnShop,
  getOwnShop,
  getAllShop,
} = require("../../controller/UserController");
const upload = require("../../middleware/uploadImage");
const { verifiManager } = require("../../middleware/verifiManager");
_.get("/shop/:email", getOwnShop);
_.get("/shop", verifiManager, getAllShop);
_.post("/create-user", createUser);
_.post("/create-shop", upload.single("shop_logo"), createOwnShop);
module.exports = _;
// /user/create-user
