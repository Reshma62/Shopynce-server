const mongoose = require("mongoose");
const { Schema } = mongoose;
const checkOutSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});
const CheckOUt = mongoose.model("CheckOUt", checkOutSchema);
module.exports = CheckOUt;
