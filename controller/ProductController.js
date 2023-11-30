const mongoose = require("mongoose");
const CreateShop = require("../models/createShopModels");
const Product = require("../models/productModels");
const User = require("../models/userModels");
const CheckOUt = require("../models/checkOutModels");
const GetPaid = require("../models/getPaidModels");
const Sales = require("../models/salesModels");
const Cart = require("../models/cartModels");
const SoldProduct = require("../models/soldProductModels");

// Add product routes
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
      product_image,
    } = req.body;
    const taxPercentage = 7.5; // 7.5% tax
    // 700 / 100 * 10
    const taxAmount =
      (parseFloat(production_cost) / 100) * parseFloat(taxPercentage);
    const discountAmount =
      (parseFloat(production_cost) * parseFloat(discount)) / 100;
    const profitAmount =
      (parseFloat(production_cost) * parseFloat(profit)) / 100;
    const sellingPrice = parseFloat(production_cost) + taxAmount + profitAmount;
    const sellingPriceAfterDiscount = sellingPrice - discountAmount;

    const profitAfterSale = sellingPrice - parseFloat(production_cost);
    const userEmail = req.query?.email;
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
        product_image,
        quantity,
        production_cost,
        profitPercent: profitAmount,
        profitAmount: profitAfterSale,
        discount: discountAmount,
        selling_price: sellingPrice,
        shop_by_id: shop._id,
        userEmail: user.email,
        selling_price_with_discount: sellingPriceAfterDiscount,
      });

      // Save the product to the database
      await product.save();
      // Update the products array in the CreateShop collection
      await CreateShop.findOneAndUpdate(
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

// get all products for logged in user
const getAllProduct = async (req, res) => {
  const queryEmail = req.query?.email;
  let query = { userEmail: queryEmail };

  const allProduct = await Product.find(query);
  res.send(allProduct);
};

//get single product
const getSigleProduct = async (req, res) => {
  const id = await req.query?.id;
  const product = await Product.findOne({ _id: id });
  res.send(product);
};

//Update single product
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
    product_image,
  } = req.body;
  const updatedProduct = {
    name: product_name,
    location: product_location,
    product_description: product_desc,
    product_image,
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

// Delete a product
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const productFind = await Product.findById(id);
  const shop = await CreateShop.findById(productFind.shop_by_id);
  console.log("shop", shop);
  const product = await Product.findOneAndDelete({ _id: id });
  await CreateShop.findOneAndUpdate(
    { _id: shop._id },
    { $pull: { products: id } },
    { new: true }
  );
  res.send({ success: "Product deleted successfully" });
};

const soldProducts = async (req, res) => {
  const userEmail = req?.query?.email;
  const perPage = parseInt(req?.query?.perPage);
  const size = parseInt(req?.query?.size);
  const skip = perPage * size;
  console.log("perPage", perPage);
  console.log("size", size);
  console.log("skip", size);
  const soldProduct = await GetPaid.find({ userEmail })
    .populate({
      path: "checkOutsProductId",
    })
    .exec();
  res.send(soldProduct);
};

// Add to cart items
const addToCart = async (req, res) => {
  const { email, productId, quantity } = req.body;
  // Check if the user already has a cart
  let cart = await Cart.findOne({ email });
  console.log(email, productId, quantity, "object");
  // If the user doesn't have a cart, create a new one
  if (!cart) {
    cart = await Cart.create({ email });
  }
  const existingItem = cart.items.find((item) =>
    item.productId.equals(productId)
  );

  if (existingItem) {
    // If the product is already in the cart, update the quantity
    existingItem.quantity += quantity;
  } else {
    // If the product is not in the cart, add a new item
    cart.items.push({ productId, quantity });
  }
  // Save the updated cart
  await cart.save();
  res.status(200).json({ message: "Item added to the cart successfully" });
};

// get cart data
const getCartItems = async (req, res) => {
  const email = req?.query?.email;
  const cart = await Cart.findOne({ email })
    .populate({
      path: "items.productId", // Populate the product_id field directly
    })
    .lean();

  if (!cart) {
    return res.status(404).json({ message: "Cart not found for the user" });
  }
  // Return the array of product details
  res.status(200).json({ items: cart.items });
};

// Sold products
const addSoldProducts = async (req, res) => {
  const email = req?.query?.email;
  const cart = await Cart.findOne({ email }).populate({
    path: "items.productId", // Populate the product_id field directly
  });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found for the user" });
  }
  // Create entries in SoldProduct collection and update Product collection
  const soldProducts = await Promise.all(
    cart.items.map(async (item) => {
      const soldProduct = new SoldProduct({
        userEmail: email,
        productId: item.productId._id,
        quantity: item.quantity,
      });
      await soldProduct.save();

      // Update product sales_count
      await Product.updateOne(
        { _id: item.productId._id },
        {
          $inc: {
            sale_count: parseInt(item.quantity, 10),
            quantity: parseInt(-item.quantity),
          },
        }
      );
      return soldProduct;
    })
  );
  // Clear the user's cart
  await Cart.updateOne({ email }, { $set: { items: [] } });

  // Return the sold products
  res.status(200).json({ message: "Checkout successful!", soldProducts });
};

// Get Sold products
const getSoldProducts = async (req, res) => {
  const email = req.params.email;
  const page = parseInt(req?.query?.page);
  const size = parseInt(req?.query?.size);
  const skip = page * size;

  const sortDirection = req.query.sort === "asc" ? 1 : -1;

  const soldProducts = await SoldProduct.find({ userEmail: email })
    .populate({
      path: "productId",
    })
    .skip(skip)
    .limit(size)
    .sort({ sale_date: sortDirection });

  res.send(soldProducts);
};

// get all sold products  count
const getAllSoldCount = async (req, res) => {
  const email = req?.query?.email;
  const count = await SoldProduct.countDocuments({ userEmail: email });

  res.send({ count });
};

// calculate the total cost of a product
const calculateTotal = async (req, res) => {
  const { email } = req.params;

  const aggregationPipeline = [
    // Match documents for the specified user
    { $match: { userEmail: email } },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "soldProducts",
      },
    },
    {
      $unwind: "$soldProducts",
    },
    {
      $group: {
        _id: "$soldProducts._id",
        sale_count: { $sum: "$soldProducts.sale_count" },
        revenue: { $sum: "$soldProducts.profitAmount" },
        production_cost: { $sum: "$soldProducts.production_cost" },
        selling_price: { $sum: "$soldProducts.selling_price" },
      },
    },
    {
      $project: {
        _id: 1,
        sale_count: 1,
        totalProfit: { $multiply: ["$sale_count", "$revenue"] },
        totalProductCost: { $multiply: ["$sale_count", "$production_cost"] },
        totalSellingPrice: { $multiply: ["$sale_count", "$selling_price"] },
      },
    },
    // Additional stages if needed
    {
      $group: {
        _id: null,
        totalProfit: { $sum: "$totalProfit" },
        totalProductionCost: { $sum: "$totalProductCost" },
        totalSellingPrice: { $sum: "$totalSellingPrice" },
      },
    },
  ];

  const result = await SoldProduct.aggregate(aggregationPipeline);

  // Extract the calculated totals from the result
  const totals =
    result.length > 0
      ? result[0]
      : { totalSellingPrice: 0, totalProductionCost: 0, totalProfit: 0 };

  res.status(200).json({ totals });
};
// exports all controllers
module.exports = {
  addProduct,
  getAllProduct,
  getSigleProduct,
  updateProduct,
  deleteProduct,
  soldProducts,
  addToCart,
  getCartItems,
  addSoldProducts,
  getSoldProducts,
  calculateTotal,
  getAllSoldCount,
};
