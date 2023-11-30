// cartModel.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  // Add other fields specific to each cart item, e.g., price, subtotal, etc.
});

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  items: [cartItemSchema],
  // Add other fields based on your needs, e.g., total_amount, discount, etc.
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
