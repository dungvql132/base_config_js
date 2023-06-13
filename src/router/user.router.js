const userController = require("@src/controller/user.controller");

const express = require("express");
const app = express();
// Define your routes and middleware here

app.post("/users/register", userController.userRegisterController);

app.post("/users/login", userController.userLoginController);

module.exports = {
    app
};
