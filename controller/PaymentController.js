const CreateShop = require("../models/createShopModels");
const Payment = require("../models/paymentsModels");
const User = require("../models/userModels");

const stripe = require("stripe")(process.env.STRIPE_SK);

const paymentStripe = async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  console.log(amount, "amount inside the intent");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
const payments = async (req, res) => {
  const userEmail = req?.user?.email;

  const { email, price, transactionId, subscribePlan, extendLimit } = req.body;
  const payment = new Payment({
    email,
    price,
    transactionId,
    subscribePlan,
    extendLimit,
  });

  //productLimit
  //   subscribePlan;
  await payment.save();
  const user = await User.find({});
  const isAdmin = user.find((data) => data.role === "admin");
  const previousIncome = parseFloat(isAdmin?.income);

  if (isAdmin) {
    await User.findOneAndUpdate(
      { role: isAdmin.role },
      { $set: { income: parseFloat(price) + previousIncome } },
      { new: true }
    );
    await CreateShop.findOneAndUpdate(
      { email: email },
      { $set: { productLimit: extendLimit, subscribePlan: subscribePlan } },
      { new: true }
    );
  }
  res.send(payment);
};
module.exports = {
  paymentStripe,
  payments,
};
