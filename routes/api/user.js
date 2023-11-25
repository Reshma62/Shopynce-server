const express = require("express");
const _ = express.Router();
const {
  createUser,
  createOwnShop,
} = require("../../controller/UserController");
const upload = require("../../middleware/uploadImage");
_.post("/create-user", createUser);
_.post("/create-shop", upload.single("shop_logo"), createOwnShop);
module.exports = _;
// /user/create-user
