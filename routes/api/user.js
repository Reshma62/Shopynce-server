const express = require("express");
const _ = express.Router();
_.get("/", (req, res) => {
  res.send({ message: "successfully" });
});
module.exports = _;
