// const customerController = require("@src/controller/customers.controller");
const { ControllerFactory } = require("@src/factory/controller.factory");
const { CustomerEntity } = require("@src/entity/Customer.entity");

// const express = require('express');
// const app = express();
// // Define your routes and middleware here

// app
// .get('/customers/:id?', customerController.findCustomers_controller)
// .post('/customers/', customerController.addCustomers_controller)
// .put('/customers/', customerController.updateCustomers_controller)
// .delete('/customers/', customerController.deleteCustomers_controller);

const customerRouter = new ControllerFactory('/customers', CustomerEntity)


module.exports = {
    app: customerRouter.app
}