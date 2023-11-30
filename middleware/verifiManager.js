const User = require("../models/userModels");

const verifiManager = async (req, res, next) => {
  const userEmail = req?.user?.email;

  const admin = await User.findOne({ email: userEmail });
  if (admin.role !== "manager") {
    return res.status(404).send({ message: " unauthorized" });
  }
  next();
};
module.exports = {
  verifiManager,
};
