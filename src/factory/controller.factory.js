const { add_controller, delete_controller, find_controller, update_controller } = require('@src/controller/common.controller')
const express = require('express');
const validateSchema = require('@src/utils/validate');
const { createValidateMiddlewere } = require('@src/middlewere/validate');

class ControllerFactory {
    constructor(url, tableEntity) {
        this.find_controller_factory = function (req, res, next) {
            find_controller(req, res, next, tableEntity)
        }
        this.add_controller_factory = function (req, res, next) {
            add_controller(req, res, next, tableEntity)
        }
        this.update_controller_factory = function (req, res, next) {
            update_controller(req, res, next, tableEntity)
        }
        this.delete_controller_factory = function (req, res, next) {
            delete_controller(req, res, next, tableEntity)
        }
        this.app = express();

        if(validateSchema[tableEntity.getTableName]){
            if(validateSchema[tableEntity.getTableName]['get']){
                this.app.get(`${url}/`,createValidateMiddlewere(validateSchema[tableEntity.getTableName]['get']))
            }
            if(validateSchema[tableEntity.getTableName]['post']){
                this.app.post(`${url}/`,createValidateMiddlewere(validateSchema[tableEntity.getTableName]['post']))
            }
            if(validateSchema[tableEntity.getTableName]['put']){
                this.app.put(`${url}/`,createValidateMiddlewere(validateSchema[tableEntity.getTableName]['put']))
            }
            if(validateSchema[tableEntity.getTableName]['delete']){
                this.app.delete(`${url}/`,createValidateMiddlewere(validateSchema[tableEntity.getTableName]['delete']))
            }
        }

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