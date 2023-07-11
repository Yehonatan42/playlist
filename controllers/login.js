const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("./authentication.js");

const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a username and password" });
    }

    const user = await User.findOne({ username: username});
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAuthToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

module.exports = { login };
