const express = require("express");
const _ = express.Router();
_.get("/access-tokek", (req, res) => {
  res.send({ message: "access token successfully" });
});
module.exports = _;
