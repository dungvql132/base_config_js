require("dotenv").config();

// --------------- Connect to MongoDB
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/mydatabase"; // MongoDB connection URL

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

// --------- Connect to PostgreSQL database

const { Client } = require("pg");

// Create a client to connect to the PostgreSQL database
const client = new Client({
    user: process.env.PG_USER, // PostgreSQL username
    host: process.env.PG_HOST, // PostgreSQL server address
    database: process.env.PG_DATABASE, // Database name
    password: process.env.PG_PASSWORD, // PostgreSQL password
    port: process.env.PG_PORT // PostgreSQL default port
});

/**
 * Execute a query to PostgreSQL and return a Promise with the query result.
 * @param {string} query - SQL query.
 * @returns {Promise} - Promise with the query result.
 */
function getQueryPromise(query) {
    return client.query(query);
}

client
    .connect()
    .then(() => {
        console.log("Connected to PostgreSQL database");
        // Perform queries here
    })
    .catch(err => {
        console.error("Error connecting to PostgreSQL database:", err);
    });

module.exports = {
    getQueryPromise,
    client
};
