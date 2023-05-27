const { add_controller, delete_controller, find_controller, update_controller } = require('@src/controller/common.controller')
const express = require('express');

class ControllerFactory {
    constructor(url, tableName) {
        this.find_controller_factory = function(req,res,next){
            find_controller(req, res, next, tableName)
        }
        this.add_controller_factory = function(req,res,next){
            add_controller(req, res, next, tableName)
        }
        this.update_controller_factory = function(req,res,next){
            update_controller(req, res, next, tableName)
        }
        this.delete_controller_factory = function(req,res,next){
            delete_controller(req, res, next, tableName)
        }
        this.app = express();

        this.app
            .get(`${url}/`, this.find_controller_factory)
            .post(`${url}/`, this.add_controller_factory)
            .put(`${url}/`, this.update_controller_factory)
            .delete(`${url}/`, this.delete_controller_factory);
    }
}

module.exports = {
    ControllerFactory
}