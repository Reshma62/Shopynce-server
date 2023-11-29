const Product = require("../models/productModels");
const User = require("../models/userModels");
const { emailTempalte } = require("../utils/emailTemplate");
const { sendPromotionalEmail } = require("../utils/sendEmails");

const getAllProducts = async (req, res) => {
  const allProducts = await Product.find({});

  res.send(allProducts);
};
const getAdminInfo = async (req, res) => {
  const email = req.query?.email;

  if (email) {
    const adminInfo = await User.findOne({ email });
    return res.send(adminInfo);
  }
};
const getAllUser = async (req, res) => {
  const adminInfo = await User.find({}).populate("shopId");
  return res.send(adminInfo);
};
const sendEmailPromotion = async (req, res) => {
  const email = req?.query?.email;

  const emailPromotion = await sendPromotionalEmail(
    email,
    emailTempalte(),
    "email promotion subject"
  );
  res.send({ success: "promtional Email send" });
};
module.exports = {
  getAllProducts,
  getAdminInfo,
  getAllUser,
  sendEmailPromotion,
};
