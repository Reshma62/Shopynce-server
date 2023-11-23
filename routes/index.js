const express = require("express");
const _ = express.Router();

const baseUrl = process.env.BASE_URL;
const apiRoutes = require("./api/index.js");

_.use(baseUrl, apiRoutes);
_.use(baseUrl, (req, res) => {
  return res.send({ error: "Invalid Routes" });
});

module.exports = _;
