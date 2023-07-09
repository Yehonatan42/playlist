const {connect} = require("mongoose");
require("dotenv").config();
const mongoUrl = process.env.MONGODB_URI;

const connectToDB = async () => {
  try {
    await connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (err) {
    throw err;
  }
};

module.exports = {connectToDB};