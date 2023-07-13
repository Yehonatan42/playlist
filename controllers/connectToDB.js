require("dotenv").config();
let mongoUrl = process.env.MONGODB_URI;
const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    if (process.env.NODE_ENV === 'TEST') {
      mongoUrl = process.env.__MONGODB_URI__;
    }

    const conn = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = { connectToDB, disconnectDB };