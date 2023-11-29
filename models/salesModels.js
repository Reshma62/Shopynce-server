// Sales model definition
const mongoose = require("mongoose");

const salesItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  // Add other fields specific to each sold item, e.g., price, subtotal, etc.
});

const salesSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  items: [salesItemSchema],
});

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
