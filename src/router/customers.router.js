const customerController = require("@src/controller/customers.controller")

const express = require('express');
const app = express();
// Define your routes and middleware here

app
.get('/customers/:id?', customerController.findCustomers_controller)
.post('/customers/', customerController.addCustomers_controller)
.put('/customers/', customerController.updateCustomers_controller)
.delete('/customers/', customerController.deleteCustomers_controller);


module.exports = {
    app
}