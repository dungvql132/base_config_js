const { getQueryPromise } = require("@src/database/connect");
const { convertToWhereCondition } = require("@src/utils/rule.condition");
const {
    fromObjToStringValues,
    fromObjToStringKeysValues
} = require("@src/utils/handle.array");
const { Repository, setEntity } = require("@src/entity/Repository");
const { standardizedRule } = require("@src/utils/callDB/standardizedRule");

class RepositoryWithRule extends Repository {
    rules;
    entity;
    user;

    constructor(entity, user) {
        super(entity);
        this.entity = entity;
        this.user = user;
    }

    static setEntity = setEntity;

    async setRules() {
        await this.user.group_ids.get(Repository);
        let rules = {};

        const group_ids = this.user.group_ids.valueORM;
        for (let i = 0; i < group_ids.length; i++) {
            await group_ids[i].rule_ids.get(Repository);
            rules = group_ids[i].rule_ids.valueORM.reduce(
                (rs, value) => {
                    const tablename = value.tablename.value;
                    const type = value.type.value;

                    let rule = value.rule.value;
                    rule = JSON.parse(rule);
                    if (tablename === this.entity.getTableName) {
                        if (!rs[type]) {
                            rs[type] = [...rule];
                        } else {
                            rs[type] = ["|", ...rs[type], ...rule];
                        }
                    }
                    return rs;
                },
                { ...rules }
            );
        }
        const ruleKeys = Object.keys(rules);
        for (let i = 0; i < ruleKeys.length; i++) {
            rules[ruleKeys[i]] = await standardizedRule(
                { username: this.user.username.value },
                rules[ruleKeys[i]],
                this.entity.getTableName
            );
        }

        this.rules = rules;
    }

    async find(
        options = {
            where: null
        }
    ) {
        // Create the initial SQL statement
        let query = `SELECT * FROM ${this.entity.getTableName}`;

        const ruleRead = this.rules["read"];

        // Add the WHERE condition if provided and there is a read rule
        if (options.where && ruleRead) {
            const whereCondition = convertToWhereCondition([
                "&",
                ...options.where,
                ...ruleRead
            ]);
            query += ` WHERE ${whereCondition}`;
        } else if (options.where && !ruleRead) {
            const whereCondition = convertToWhereCondition([...options.where]);
            query += ` WHERE ${whereCondition}`;
        } else if (!options.where && ruleRead) {
            const whereCondition = convertToWhereCondition([...ruleRead]);
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
            addValueList.push(`(${fromObjToStringValues(element, keys)})`);
        });

        // Add each value to the query
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
        // Create the initial UPDATE statement
        let query = `UPDATE ${this.entity.getTableName}
        SET `;

        // Add the SET values that will change
        query += fromObjToStringKeysValues(newValue);

        const ruleRead = this.rules["update"];

        // Add the WHERE condition if provided and there is an update rule
        if (options.where && ruleRead) {
            const whereCondition = convertToWhereCondition([
                "&",
                ...options.where,
                ...ruleRead
            ]);
            query += ` WHERE ${whereCondition}`;
        } else if (options.where && !ruleRead) {
            const whereCondition = convertToWhereCondition([...options.where]);
            query += ` WHERE ${whereCondition}`;
        } else if (!options.where && ruleRead) {
            const whereCondition = convertToWhereCondition([...ruleRead]);
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
        // Create the initial DELETE statement
        let query = `DELETE FROM ${this.entity.getTableName}`;

        const ruleRead = this.rules["delete"];

        // Add the WHERE condition if provided and there is a delete rule
        if (options.where && ruleRead) {
            const whereCondition = convertToWhereCondition([
                "&",
                ...options.where,
                ...ruleRead
            ]);
            query += ` WHERE ${whereCondition}`;
        } else if (options.where && !ruleRead) {
            const whereCondition = convertToWhereCondition([...options.where]);
            query += ` WHERE ${whereCondition}`;
        } else if (!options.where && ruleRead) {
            const whereCondition = convertToWhereCondition([...ruleRead]);
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
}

module.exports = {
    RepositoryWithRule
};
