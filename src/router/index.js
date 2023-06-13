const employeeRouter = require("./employees.router");
const customerRouter = require("./customers.router");
const userRouter = require("./user.router");
const { checkTokenMiddleware } = require("@src/middlewere/authen");
const { handleErrorController } = require("@src/controller/error.controller");

const express = require("express");
const app = express();
// Define your routes and middleware here

app.use("/api", checkTokenMiddleware);

app.use("/api", employeeRouter.app);
app.use("/api", customerRouter.app);
app.use(userRouter.app);
app.use(handleErrorController);

module.exports = {
    app
};
