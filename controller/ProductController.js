const mongoose = require("mongoose");
const CreateShop = require("../models/createShopModels");
const Product = require("../models/productModels");
const User = require("../models/userModels");
const CheckOUt = require("../models/checkOutModels");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      location,
      product_description,
      quantity,
      production_cost,
      profit,
      discount,
    } = req.body;
    const taxPercentage = 7.5; // 7.5% tax
    const taxAmount =
      (parseFloat(production_cost) * parseFloat(taxPercentage)) / 100;
    const discountAmount =
      (parseFloat(production_cost) * parseFloat(discount)) / 100;
    const profitAmount =
      (parseFloat(production_cost) * parseFloat(profit)) / 100;
    const sellingPrice = parseFloat(production_cost) + taxAmount + profitAmount;

    const userEmail = req.user?.email;

    // Find the user based on the email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).json({ error: "User not found" });
    }

    // Now that you have the user, find the associated shop
    const shop = await CreateShop.findOne({ userId: user._id });

    if (!shop) {
      // Handle the case where the shop is not found
      return res.status(404).json({ error: "Shop not found" });
    }
    if (user.email === userEmail) {
      // Check if the product limit has been reached
      if (shop.products.length === shop.productLimit) {
        // Send an error message if the product limit is exceeded
        return res.status(400).send({ error: "Product limit exceeded" });
      }

      // Create the product using the fetched shop ID
      const product = new Product({
        name,
        location,
        product_description,
        product_image: `/uploads/${req?.file?.filename}`,
        quantity,
        production_cost,
        profit: profitAmount,
        discount: discountAmount,
        selling_price: sellingPrice,
        shop_by_id: shop._id,
        userEmail: user.email,
      });

      // Save the product to the database
      await product.save();
      // Update the products array in the CreateShop collection
      await CreateShop.findByIdAndUpdate(
        { _id: shop._id },
        { $push: { products: product._id } },
        { new: true }
      );
      return res.send({ success: "Product added successfully" });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllProduct = async (req, res) => {
  const queryEmail = req.user?.email;
  let query = { userEmail: queryEmail };

  const allProduct = await Product.find(query);
  res.send(allProduct);
};

const getSigleProduct = async (req, res) => {
  const id = await req.query?.id;
  const product = await Product.findOne({ _id: id });
  res.send(product);
};
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const {
    product_name,
    product_location,
    product_desc,
    quantity,
    production_cost,
    profit,
    discount,
  } = req.body;
  const updatedProduct = {
    name: product_name,
    location: product_location,
    product_description: product_desc,
    product_image: `/uploads/${req?.file?.filename}`,
    quantity,
    production_cost,
    profit,
    discount,
  };
  const product = await Product.findOneAndUpdate({ _id: id }, updatedProduct, {
    new: true,
  });
  res.send(product);
};
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const productFind = await Product.findById(id);
  const shop = await CreateShop.findById(productFind.shop_by_id);
  console.log("shop", shop);
  const product = await Product.findOneAndDelete({ _id: id });
  await CreateShop.findByIdAndUpdate(
    { _id: shop._id },
    { $pull: { products: id } },
    { new: true }
  );
  res.send({ success: "Product deleted successfully" });
};
const addTocheckOut = async (req, res) => {
  const { productId } = req.body;
  const isExist = await CheckOUt.findOne({ productId });
  if (isExist) {
    return res.send({ error: "Product Already Added the CheckOut page" });
  }
  const checkout = new CheckOUt({
    productId,
  });
  checkout.save();
  res.send(checkout);
};
const getCheckOutProduct = async (req, res) => {
  const userEmail = req.user?.email;
  const checkoutProducts = await CheckOUt.find({})
    .populate({
      path: "productId",
      match: { userEmail: userEmail },
    })
    .exec();

  // Filter out documents where productId is null
  const filteredProducts = checkoutProducts.filter(
    (checkout) => checkout.productId !== null
  );

  res.send(filteredProducts);
};
module.exports = {
  addProduct,
  getAllProduct,
  getSigleProduct,
  updateProduct,
  deleteProduct,
  addTocheckOut,
  getCheckOutProduct,
};
