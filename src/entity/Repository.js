const { getQueryPromise } = require("@src/database/connect");
const { convertToWhereCondition } = require("@src/utils/rule.condition");
const {
    convertObjectToStringValues,
    convertObjectToStringKeysValues
} = require("@src/utils/handle.array");
const { findEntity } = require("@src/entity");
const {
    getManyToOne,
    getManyToMany,
    getOneToMany
} = require("@src/utils/callDB/entityQuery");
const { type } = require("@src/common/entity.common");

class Repository {
    constructor(entity) {
        this.entity = entity;
    }

    static setEntity = setEntity;

    async find(
        options = {
            where: null
        }
    ) {
        // Create the initial SQL statement
        let query = `SELECT * FROM ${this.entity.getTableName}`;

        // Add the WHERE condition if provided
        if (options.where) {
            const whereCondition = convertToWhereCondition(options.where);
            query += ` WHERE ${whereCondition}`;
        }
        console.log("query: ", query);

        // Execute the query
        let data = await getQueryPromise(query);
        let rs = data.rows.map(value => {
            let obj = new this.entity();
            setEntity(obj, value);
            return obj;
        });

        return {
            datas: rs,
            rawDatas: data.rows,
            query
        };
    }

    async add(...rest) {
        if (rest.length === 0) {
            return;
        }

        // Get the list of keys (fields in the database)
        const keys = Object.keys(rest[0]);
        let query = `
            INSERT INTO ${this.entity.getTableName} (${keys.join(", ")})
                VALUES `;

        const addValueList = [];
        rest.forEach(element => {
            addValueList.push(
                `(${convertObjectToStringValues(element, keys)})`
            );
        });

        // Add each value to the query statement
        query += addValueList.join(", ");
        console.log("query: ", query);

        // Execute the query
        let data = await getQueryPromise(query);
        return {
            data,
            query
        };
    }

    async update(
        options = {
            where: null
        },
        newValue
    ) {
        // Create the initial update statement
        let query = `UPDATE ${this.entity.getTableName}
        SET `;

        // Add the updated values to the query statement
        query += convertObjectToStringKeysValues(newValue);

        // Add the WHERE condition if provided
        if (options.where) {
            const whereCondition = convertToWhereCondition(options.where);
            query += ` WHERE ${whereCondition}`;
        }
        console.log("query: ", query);

        // Execute the query
        let data = await getQueryPromise(query);
        return {
            data,
            query
        };
    }

    async delete(
        options = {
            where: null
        }
    ) {
        // Create the initial delete statement
        let query = `DELETE FROM ${this.entity.getTableName}`;

        // Add the WHERE condition if provided
        if (options.where) {
            const whereCondition = convertToWhereCondition(options.where);
            query += ` WHERE ${whereCondition}`;
        }

        // Execute the query
        let data = await getQueryPromise(query);
        return {
            data,
            query
        };
    }
}

function setEntity(entityObject, data) {
    let primanys = [];
    Object.keys(entityObject).forEach(key => {
        if (
            entityObject[key].type &&
            (entityObject[key].type === type.primitive ||
                entityObject[key].type === type.many2one)
        ) {
            entityObject[key].value = data[key.toLocaleLowerCase()];
        }

        if (entityObject[key].isPrimany) {
            primanys.push(key);
        }

        if (typeof entityObject[key] === "object") {
            entityObject[key]["parent"] = entityObject;
        }

        if (entityObject[key].type === type.many2one) {
            entityObject[key]["get"] = getManyToOne;
            entityObject[key]["tableTo"] = findEntity(
                entityObject[key].tableNameTo
            );
        }

        if (entityObject[key].type === type.many2many) {
            entityObject[key]["get"] = getManyToMany;
            entityObject[key]["tableTo"] = findEntity(
                entityObject[key].tableNameTo
            );
        }

        if (entityObject[key].type === type.one2many) {
            entityObject[key]["get"] = getOneToMany;
            entityObject[key]["tableTo"] = findEntity(
                entityObject[key].tableNameTo
            );
        }
    });

    entityObject.primanys = primanys;
    return entityObject;
}

function isEqualEntity(entity_1, entity_2) {}

function isEntityInList(entity, entityList) {}

module.exports = {
    Repository,
    setEntity
};
