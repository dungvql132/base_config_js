const userController = require("@src/controller/user.controller")

const express = require('express');
const app = express();
// Define your routes and middleware here

app
.post('/users/register', userController.userRegister_controller)

app
.post('/users/login', userController.userLogin_controller)


module.exports = {
    app
}