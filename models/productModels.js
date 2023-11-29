const mongoose = require("mongoose");
const { Schema } = mongoose;
const prodructSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  product_image: {
    type: String,
    // required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  production_cost: {
    type: String,
    required: true,
  },
  profitPercent: {
    type: String,
    required: true,
  },
  profitAmount: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },

  sale_count: {
    type: Number,
    default: 0,
  },
  selling_price: {
    type: Number,
    default: 0,
  },
  selling_price_with_discount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  shop_by_id: {
    type: Schema.Types.ObjectId,
    ref: "CreateShop",
  },
});
const Product = mongoose.model("Product", prodructSchema);
module.exports = Product;
