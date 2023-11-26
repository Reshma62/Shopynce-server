const express = require("express");
const _ = express.Router();
const User = require("./user");
const Auth = require("./auth");
const Manager = require("./manager");
_.use("/user", User);
_.use("/auth", Auth);
_.use("/manager", Manager);
module.exports = _;
