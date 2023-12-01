const express = require("express");
const _ = express.Router();
const {
  createUser,
  createOwnShop,
  getOwnShop,
  getAllShop,
  wantToManager,
} = require("../../controller/UserController");
const { verifiManager } = require("../../middleware/verifiManager");
_.get("/shop/:email", getOwnShop);
_.get("/all-shop", getAllShop);
_.post("/create-user", createUser);
_.put("/want-to-manager/:id", wantToManager);
_.post("/create-shop", createOwnShop);
module.exports = _;
// /user/create-user
