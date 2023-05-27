const employeeRouter = require("./employees.router")
const customerRouter = require("./customers.router")
const userRouter = require("./user.router")
const { checkToken_middlewere } = require('@src/middlewere/authen')
const { checkRule_middlewere } = require('@src/middlewere/checkRule')

const express = require('express');
const app = express();
// Define your routes and middleware here

app.use('/api',checkRule_middlewere)

app.use('/api', employeeRouter.app);
app.use('/api', customerRouter.app);
app.use(userRouter.app);

module.exports = {
    app
}