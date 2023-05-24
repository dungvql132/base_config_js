const employeeRouter = require("./employees.router")
const customerRouter = require("./customers.router")

const express = require('express');
const app = express();
// Define your routes and middleware here

app.use(employeeRouter.app);
app.use(customerRouter.app);

module.exports = {
    app
}