const CreateShop = require("../models/createShopModels");
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
  const { page, size } = req?.query;
  const pageNumber = parseInt(page);
  const limit = parseInt(size);
  const skip = limit * pageNumber;
  console.log("pageNumber", pageNumber);
  console.log("limit", limit);
  console.log("skip", skip);
  const userInfo = await User.find({})
    .populate("shopId")
    .skip(skip)
    .limit(limit);
  return res.send(userInfo);
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
const sendNotice = async (req, res) => {
  const email = req?.query?.email;

  const emailPromotion = await sendPromotionalEmail(
    email,
    emailTempalte(),
    "Notices from admin"
  );
  res.send({ success: "Notice Email send" });
};

const getAllShop = async (req, res) => {
  const allShop = await CreateShop.find({});
  res.send(allShop);
};
module.exports = {
  getAllProducts,
  getAdminInfo,
  getAllUser,
  sendEmailPromotion,
  getAllShop,
  sendNotice,
};
