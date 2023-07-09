const User = require("../models/user");
const {generateAuthToken} = require("./authentication.js");

const registration =  async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a username and password' });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username is already taken' });
      }
   
      const user = new User({ username, password });
      await user.save();
      const token = generateAuthToken(user);
      res.status(200).json({token});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  };
  
module.exports = {registration};