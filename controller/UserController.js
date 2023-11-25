const User = require("../models/userModels");

const createUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name) {
    return res.send({ error: "name is required" });
  } else if (!email) {
    return res.send({ error: "Email is required" });
  }
  const exitingUser = await User.find({ email });
  if (exitingUser.length > 0) {
    return res.send({ error: "User already exists" });
  }
  const user = new User({
    name,
    email,
  });
  user.save();
  res.send({ success: "user successfully created" });
};

module.exports = {
  createUser,
};
