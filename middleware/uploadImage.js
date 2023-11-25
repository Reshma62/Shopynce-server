const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
    console.log("file", file);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() * 2;

    const fileExtension = path.extname(file?.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
