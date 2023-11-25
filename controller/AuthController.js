const User = require("../models/userModels");

const getUser = async (req, res) => {
  let query = {};
  const email = req?.query?.email;
  if (email) {
    query = { email: email };
  }
  const user = await User.findOne(query);
  res.send(user);
};
module.exports = {
  getUser,
};
