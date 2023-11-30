const express = require("express");
const { getUser, createToken } = require("../../controller/AuthController");

const _ = express.Router();

_.get("/get-user", getUser);

// token routes
_.post("/create-token", createToken);
module.exports = _;
