const User = require("../models/userModels");

const verifiAdmin = async (req, res, next) => {
  const userEmail = req?.user?.email;

  const admin = await User.findOne({ email: userEmail });
  if (admin.role !== "admin") {
    return res.status(404).send({ message: " unauthorized" });
  }
  next();
};
module.exports = {
  verifiAdmin,
};
