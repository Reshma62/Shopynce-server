const express = require("express");
const {
  getUser,
  createToken,
  deleteToken,
} = require("../../controller/AuthController");
const verifiToken = require("../../middleware/verifiToken");
const _ = express.Router();

_.get("/get-user", verifiToken, getUser);

// token routes
_.post("/create-token", createToken);
_.post("/delete-token", deleteToken);
module.exports = _;
