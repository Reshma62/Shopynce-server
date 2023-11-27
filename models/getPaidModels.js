const mongoose = require("mongoose");
const { Schema } = mongoose;
const getPaidSchema = new Schema({
  checkOutsProductId: [
    {
      type: Schema.Types.ObjectId,
      ref: "CheckOUt",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const GetPaid = mongoose.model("GetPaid", getPaidSchema);
module.exports = GetPaid;
