const mongoUrl = 'mongodb://localhost:27017/mydatabase';
const {connect} = require("mongoose");

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