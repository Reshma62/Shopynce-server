const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongodb is Connected!"));
};
module.exports = dbConnect;
