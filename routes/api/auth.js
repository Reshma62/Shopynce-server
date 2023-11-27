const express = require("express");
const {
  getUser,
  createToken,
  deleteToken,
} = require("../../controller/AuthController");
const _ = express.Router();

_.get("/get-user", getUser);

// token routes
_.post("/create-token", createToken);
_.post("/delete-token", deleteToken);
module.exports = _;
