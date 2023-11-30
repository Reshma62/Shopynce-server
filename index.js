const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
var cors = require("cors");
const PORT = process.env.PORT || 8000;
const Routes = require("./routes");
const dbConnect = require("./utils/dbConfige");
const verifiToken = require("./middleware/verifiToken");
const path = require("path");
//middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shopynce.web.app",
      "https://api.imgbb.com",
    ],
  })
);
app.use(cookieParser());
// app.use(express.static("public"));
/* app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "/public/uploads"))
); */
app.use(express.json());

app.use(Routes);
app.get("/health", function (req, res) {
  // console.log(req?.cookies?.token);
  res.send("server health is ok ");
});

const main = async () => {
  await dbConnect();
  app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  });
};
main();
