const mongoose = require("mongoose");
const CreateShop = require("../models/createShopModels");
const Product = require("../models/productModels");
const User = require("../models/userModels");
const CheckOUt = require("../models/checkOutModels");
const GetPaid = require("../models/getPaidModels");

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

// get all products for logged in user
const getAllProduct = async (req, res) => {
  const queryEmail = req.user?.email;
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

// Delete a product
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

// Add product to checkout
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

// Get the product from the checkout
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

// Add product to getpaid  or Invoice route

const createInvoice = async (checkOutsProductId, userEmail) => {
  const isExitsCollection = await GetPaid.findOne({ userEmail });
  /* if (isExitsCollection) {
    // If the document exists, update it
    return await GetPaid.findOneAndUpdate(
      { userEmail },
      { $push: { checkOutsProductId: checkOutsProductId } },
      { new: true }
    );
  } else { */
  // If the document doesn't exist, create a new one
  const newInvoice = new GetPaid({
    checkOutsProductId,
    userEmail,
  });
  await newInvoice.save();
  return newInvoice;
  // }
};

const updateProductSales = async (checkoutProducts) => {
  try {
    for (const checkoutProduct of checkoutProducts) {
      const productId = checkoutProduct.productId._id;
      let quantity = parseInt(checkoutProduct.productId.quantity);
      let saleCount = parseInt(checkoutProduct.productId.sale_count);

      if (quantity > 0) {
        await Product.findByIdAndUpdate(
          productId,
          {
            $set: { sale_count: saleCount + 1, quantity: quantity - 1 },
          },
          { new: true }
        );
      }
    }
  } catch (error) {
    console.error("Error updating product sales:", error);
    throw error;
  }
};

const addInvoice = async (req, res) => {
  try {
    const userEmail = req?.user?.email;
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
    const productId = filteredProducts.map((product) => product.productId);
    const newInvoice = createInvoice(productId, userEmail);

    await updateProductSales(filteredProducts);

    // Extract the IDs of the CheckOUt documents to be deleted
    const checkoutIdsToDelete = filteredProducts.map(
      (checkout) => checkout._id
    );

    // Clear the checkout collection based on the IDs
    // await CheckOUt.deleteMany({ _id: { $in: checkoutIdsToDelete } });

    res.send({ success: "Payment successful", invoice: newInvoice });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

async function getSoldProductsDetails(req, res) {
  try {
    const { limit, skip } = req?.query;
    const limitValue = parseInt(limit) || 10; // Default to 10 if not provided
    const skipValue = parseInt(skip) || 0;
    const orders = await GetPaid.find()
      .populate("checkOutsProductId")
      .limit(limitValue)
      .skip(skipValue);

    // Extract and format sold product details
    const soldProductsDetails = orders.reduce((acc, order) => {
      order.checkOutsProductId.forEach((product) => {
        acc.push({
          name: product.name,
          quantity: product.quantity, // Assuming you have a quantity field in your products array
          profit: product.profitAmount, // Assuming you have a profit field in your products array
          soldDate: order.createdAt,
        });
      });
      return acc;
      return order;
    }, []);

    res.status(200).json(soldProductsDetails);
  } catch (error) {
    console.error("Error getting sold products details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// exports all controllers
module.exports = {
  addProduct,
  getAllProduct,
  getSigleProduct,
  updateProduct,
  deleteProduct,
  addTocheckOut,
  getCheckOutProduct,
  addInvoice,
  soldProducts,
  getSoldProductsDetails,
};
