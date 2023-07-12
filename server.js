const express = require('express');
const { connectToDB, disconnectDB } = require('./controllers/connectToDB.js');
const { router } = require('./routes/router.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use('/', router);

let server;

connectToDB().then(() => {
  server = app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});

const closeServer = async () => {
  if (server) {
    await disconnectDB();
    server.close();
  }
};

module.exports = {
  app,
  closeServer
};
