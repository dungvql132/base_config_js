const { ControllerFactory } = require("@src/factory/controller.factory");
const { EmployeeEntity } = require("@src/entity/Employee.entity");

const employeeControllerFactory = new ControllerFactory(
    "/employees",
    EmployeeEntity
);

module.exports = {
    employeeControllerFactory
};
