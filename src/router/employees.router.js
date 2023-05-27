// const employeeController = require("@src/controller/employees.controller")
const { ControllerFactory } = require("@src/factory/controller.factory");
const { EmployeeEntity } = require("@src/entity/Employee.entity");
// const express = require('express');
// const app = express();
// // Define your routes and middleware here

// app
// .get('/employees/:id?', employeeController.findEmployees_controller)
// .post('/employees/', employeeController.addEmployees_controller)
// .put('/employees/', employeeController.updateEmployees_controller)
// .delete('/employees/', employeeController.deleteEmployees_controller);


const employeeControllerFactory = new ControllerFactory('/employees',EmployeeEntity)


module.exports = {
    app : employeeControllerFactory.app
}