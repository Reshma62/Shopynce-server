const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  income: {
    type: Number,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "CreateShop",
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
