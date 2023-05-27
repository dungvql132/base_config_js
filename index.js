require('module-alias/register');
const { client } = require('@src/database/connect')
require('dotenv').config(); // Import dotenv module to load .env file

const express = require('express');
const app = express();

const cors = require('cors')
const bodyParser = require('body-parser')

// Configuring body parser middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000; // Use port from .env file or default to 3000

// Define your routes and middleware here
const appRouter = require('@src/router')
app.use(appRouter.app)



app.listen(port, () => {
  client.connect()
    .then(() => {
      console.log('Connected to PostgreSQL database');
      // Thực hiện các truy vấn tại đây
    })
    .catch((err) => {
      console.error('Error connecting to PostgreSQL database:', err);
    });
  console.log(`Server is running on port ${port}`);
});
