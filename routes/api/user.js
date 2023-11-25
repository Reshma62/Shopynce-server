const express = require("express");
const _ = express.Router();
const { createUser } = require("../../controller/UserController");
_.post("/create-user", createUser);
module.exports = _;
// /user/create-user
