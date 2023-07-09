const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token found");
      return res.status(401).send("Access denied");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;

    if (!userId) {
      console.log("User ID extraction from token failed");
      return res.status(401).send("Access denied");
    }

    req.headers.userId = userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Error authenticating token");
  }
};

const generateAuthToken = (user) => {
  const token = jwt.sign({ id: user._id }, secretKey, {
    expiresIn: "10h",
  });
  return token;
};

module.exports = { authenticateToken, generateAuthToken };
