const mongoose = require("mongoose");
const { Schema } = mongoose;
const createShopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  shop_description: {
    type: String,
    required: true,
  },
  shop_logo: {
    type: String,
    required: true,
  },
  productLimit: {
    type: Number,
    default: 3,
  },
  subscribePlan: {
    type: String,
    default: "none",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  cretedAt: {
    type: Date,
    default: Date.now(),
  },
});
const CreateShop = mongoose.model("CreateShop", createShopSchema);
module.exports = CreateShop;
