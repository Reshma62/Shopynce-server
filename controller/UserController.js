const CreateShop = require("../models/createShopModels");
const Product = require("../models/productModels");
const User = require("../models/userModels");

// create a new user
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

// create shop
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

// Get OWn shop
const getOwnShop = async (req, res) => {
  const email = req.params.email;
  const shop = await CreateShop.findOne({ email: email });
  res.send(shop);
};

// Get all shop Ids
const getAllShop = async (req, res) => {
  const shop = await CreateShop.find({});
  res.send(shop);
};

// want to manager updat user information
const wantToManager = async (req, res) => {
  const shopId = req.params.id;
  const userEmail = req.query.email;
  const newShopInfo = {
    newShopId: shopId,
    role: "shopAdmin",
  };
  const updateUser = await User.findOneAndUpdate(
    { email: userEmail },
    { $push: { shopShareAccess: newShopInfo } },
    { new: true }
  );
  res.send(updateUser);
};

// all controllers are exports
module.exports = {
  createUser,
  createOwnShop,
  getOwnShop,
  getAllShop,
  wantToManager,
};
