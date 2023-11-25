const express = require("express");
const { getUser } = require("../../controller/AuthController");
const _ = express.Router();
_.get("/access-tokek", (req, res) => {
  res.send({ message: "access token successfully" });
});
_.get("/get-user", getUser);
module.exports = _;
