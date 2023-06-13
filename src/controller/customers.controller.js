const { ControllerFactory } = require("@src/factory/controller.factory");
const { CustomerEntity } = require("@src/entity/Customer.entity");

const customerRouter = new ControllerFactory("/customers", CustomerEntity);

module.exports = {
    customerRouter
};
