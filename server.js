const express = require('express');
const { connectToDB } = require('./controllers/connectToDB.js');
const { router } = require('./routes/router.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    await connectToDB();
    app.use('/', router);

  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
}

startServer();

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

module.exports = app;
