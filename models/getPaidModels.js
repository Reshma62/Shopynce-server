const mongoose = require("mongoose");
const { Schema } = mongoose;
const getPaidSchema = new Schema({
  checkOutsProductId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  userEmail: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  uniqeDate: {
    type: Date,
    default: Math.random(Date.now().getMilliseconds * 5),
  },
});
const GetPaid = mongoose.model("GetPaid", getPaidSchema);
module.exports = GetPaid;
