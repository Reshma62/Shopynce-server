const mongoose = require("mongoose");
const { Schema } = mongoose;
const checkOutSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  userId: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const CheckOUt = mongoose.model("CheckOUt", checkOutSchema);
module.exports = CheckOUt;
