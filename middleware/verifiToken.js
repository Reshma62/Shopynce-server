const jwt = require("jsonwebtoken");
const verifiToken = async (req, res, next) => {
  const token = await req?.cookies?.token;

  if (!token) {
    return res.status(401).send({ error: "unathorized access fdg" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).send("unathorided access");
    }
    req.user = decoded;

    next();
  });
};
module.exports = verifiToken;
