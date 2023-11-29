const mongoose = require("mongoose");

const soldProductSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sale_date: {
    type: Date,
    default: Date.now,
  },
  // Add other fields based on your needs
});

const SoldProduct = mongoose.model("SoldProduct", soldProductSchema);

module.exports = SoldProduct;
