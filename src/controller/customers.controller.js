const { add_controller, delete_controller, find_controller, update_controller} = require('./common.controller')

async function findCustomers_controller(req, res, next) {
    find_controller(req,res,next,'customers')
}

async function addCustomers_controller(req, res, next) {
    add_controller(req,res,next,'customers')
}

async function updateCustomers_controller(req, res, next) {
    update_controller(req,res,next,'customers')
}

async function deleteCustomers_controller(req, res, next) {
    delete_controller(req,res,next,'customers')
}

module.exports = {
    findCustomers_controller,
    addCustomers_controller,
    updateCustomers_controller,
    deleteCustomers_controller
}