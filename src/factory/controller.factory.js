const express = require("express");
const validateSchema = require("@src/utils/validate");
const { createValidateMiddleware } = require("@src/middlewere/validate");
const { Repository } = require("@src/entity/Repository");
const { UserEntity } = require("@src/entity");
const { RepositoryWithRule } = require("@src/entity/RepositoryWithRule");
const { logger_info } = require("@src/logger");

// Controller function to handle the "find" operation
async function findController(req, res, next, tableEntity) {
    try {
        const userRepository = new Repository(UserEntity);
        const user = await userRepository.find({
            where: [["username", "=", req.body.user.username]]
        });
        const resultRepository = new RepositoryWithRule(
            tableEntity,
            user.datas[0]
        );

        await resultRepository.setRules();
        let result;
        result = await resultRepository.find();
        logger_info(
            `${tableEntity.getTableName} executed query: ${result.query}`,
            req.body.user.username
        );
        res.status(200).json(result.rawDatas);
    } catch (error) {
        next(error);
    }
}

// Controller function to handle the "add" operation
async function addController(req, res, next, tableEntity) {
    try {
        const resultRepository = new Repository(tableEntity);
        let result;
        let datas = req.body.datas;
        if (datas) {
            result = await resultRepository.add(...datas);
        }
        logger_info(
            `${tableEntity.getTableName} executed query: ${result.query}`,
            req.body.user.username
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// Controller function to handle the "update" operation
async function updateController(req, res, next, tableEntity) {
    try {
        const resultRepository = new Repository(tableEntity);
        let result;
        let datas = req.body.datas;
        if (datas) {
            result = await resultRepository.update(
                datas.option,
                datas.newValue
            );
        }
        logger_info(
            `${tableEntity.getTableName} executed query: ${result.query}`,
            req.body.user.username
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// Controller function to handle the "delete" operation
async function deleteController(req, res, next, tableEntity) {
    try {
        const resultRepository = new Repository(tableEntity);
        let result;
        let datas = req.body.datas;
        if (datas) {
            result = await resultRepository.delete(datas.option);
        }
        logger_info(
            `${tableEntity.getTableName} executed query: ${result.query}`,
            req.body.user.username
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

class ControllerFactory {
    constructor(url, tableEntity) {
        this.findControllerFactory = function (req, res, next) {
            findController(req, res, next, tableEntity);
        };
        this.addControllerFactory = function (req, res, next) {
            addController(req, res, next, tableEntity);
        };
        this.updateControllerFactory = function (req, res, next) {
            updateController(req, res, next, tableEntity);
        };
        this.deleteControllerFactory = function (req, res, next) {
            deleteController(req, res, next, tableEntity);
        };
        this.app = express();

        if (validateSchema[tableEntity.getTableName]) {
            if (validateSchema[tableEntity.getTableName]["get"]) {
                this.app.get(
                    `${url}/`,
                    createValidateMiddleware(
                        validateSchema[tableEntity.getTableName]["get"]
                    )
                );
            }
            if (validateSchema[tableEntity.getTableName]["post"]) {
                this.app.post(
                    `${url}/`,
                    createValidateMiddleware(
                        validateSchema[tableEntity.getTableName]["post"]
                    )
                );
            }
            if (validateSchema[tableEntity.getTableName]["put"]) {
                this.app.put(
                    `${url}/`,
                    createValidateMiddleware(
                        validateSchema[tableEntity.getTableName]["put"]
                    )
                );
            }
            if (validateSchema[tableEntity.getTableName]["delete"]) {
                this.app.delete(
                    `${url}/`,
                    createValidateMiddleware(
                        validateSchema[tableEntity.getTableName]["delete"]
                    )
                );
            }
        }

        this.app
            .get(`${url}/`, this.findControllerFactory)
            .post(`${url}/`, this.addControllerFactory)
            .put(`${url}/`, this.updateControllerFactory)
            .delete(`${url}/`, this.deleteControllerFactory);
    }
}

module.exports = {
    ControllerFactory,
    findController,
    addController,
    updateController,
    deleteController
};
