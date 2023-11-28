const mongoose = require("mongoose");
const { Schema } = mongoose;
const paymentSchema = new Schema({
  email: {
    type: String,
  },
  price: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  subscribePlan: {
    type: String,
  },
  extendLimit: {
    type: String,
  },

  date: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    default: "pending",
  },
});
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
