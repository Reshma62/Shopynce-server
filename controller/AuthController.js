const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const getUser = async (req, res) => {
  let query = {};
  const email = req?.query?.email;
  if (email) {
    query = { email: email };
  }
  const user = await User.findOne(query);
  res.send(user);
};
const createToken = async (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.SECRET_KEY, {
    expiresIn: "1000h",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
};
const deleteToken = async (req, res) => {
  res
    .clearCookie("token", {
      maxAge: 0,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
};
module.exports = {
  getUser,
  createToken,
  deleteToken,
};
