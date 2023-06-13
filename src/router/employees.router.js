const {
    employeeControllerFactory
} = require("@src/controller/employees.controller");

module.exports = {
    app: employeeControllerFactory.app
};
