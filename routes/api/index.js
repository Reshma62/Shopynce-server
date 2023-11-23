const express = require("express");
const _ = express.Router();
const User = require("./user");
const Auth = require("./auth");
_.use("/user", User);
_.use("/auth", Auth);
module.exports = _;
