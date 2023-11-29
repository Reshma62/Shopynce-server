const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

// Get the Single user
const getUser = async (req, res) => {
  const email = req?.query?.email;
  const user = await User.findOne({ email });
  res.send(user);
};

// create token
const createToken = async (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.SECRET_KEY, {
    expiresIn: "1000h",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send({ success: true });
};

// Delete Token
const deleteToken = async (req, res) => {
  res
    .clearCookie("token", {
      maxAge: 0,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
};

// all controllers exports
module.exports = {
  getUser,
  createToken,
  deleteToken,
};
