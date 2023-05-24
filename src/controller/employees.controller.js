const { add_controller, delete_controller, find_controller, update_controller} = require('./common.controller')

async function findEmployees_controller(req, res, next) {
    find_controller(req,res,next,'employees')
}

async function addEmployees_controller(req, res, next) {
    add_controller(req,res,next,'employees')
}

async function updateEmployees_controller(req, res, next) {
    update_controller(req,res,next,'employees')
}

async function deleteEmployees_controller(req, res, next) {
    delete_controller(req,res,next,'employees')
}

module.exports = {
    findEmployees_controller,
    addEmployees_controller,
    updateEmployees_controller,
    deleteEmployees_controller
}