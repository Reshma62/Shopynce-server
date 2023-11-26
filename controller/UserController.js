const CreateShop = require("../models/createShopModels");
const Product = require("../models/productModels");
const User = require("../models/userModels");

const createUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name) {
    return res.send({ error: "name is required" });
  } else if (!email) {
    return res.send({ error: "Email is required" });
  }
  const exitingUser = await User.find({ email });
  if (exitingUser.length > 0) {
    return res.send({ error: "User already exists" });
  }
  const user = new User({
    name,
    email,
  });
  user.save();
  res.send({ success: "user successfully created" });
};
const createOwnShop = async (req, res) => {
  const { name, location, shop_description, email, userName } = await req.body;
  console.log("req?.file", req?.file);
  const exitingUser = await User.findOne({ email });

  const existingShop = await CreateShop.findOne({ email });
  if (existingShop) {
    return res.send({ error: "Only One Shop Created at a time" });
  }
  const createShop = new CreateShop({
    name,
    location,
    shop_description,
    shop_logo: `/uploads/${req?.file?.filename}`,
    email,
    userName,
    userId: exitingUser._id,
  });
  createShop.save();
  // res.send({ success: "Shop successfully created" });
  res.send(createShop);
  await User.findByIdAndUpdate(
    { _id: createShop.userId },
    { $set: { shopId: createShop._id, role: "manager" } },
    { new: true }
  );
};
module.exports = {
  createUser,
  createOwnShop,
};
