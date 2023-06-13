const { generateJoinConditionWhere } = require("@src/utils/handle.array");
const { getQueryPromise } = require("@src/database/connect");
const { logger_info } = require("@src/logger");

/**
 * Retrieve records in a many-to-one relationship
 * @param {Repository} Repository - The repository instance
 * @returns {Array} - Array of retrieved records
 */
async function getManyToOne(Repository) {
    // Handle self join
    const tableNameFrom = this.parent.tableName;
    const tableNameTo = this.tableNameTo;
    const classResult = this.tableTo;

    let tableNameFromAlias = tableNameFrom + "_1";
    let tableNameToAlias = tableNameTo + "_2";

    let joinFromAlias = `${tableNameFrom} AS ${tableNameFromAlias}`;
    let joinToAlias = `${tableNameTo} AS ${tableNameToAlias}`;
    // ------------------------------------

    let query = `SELECT ${tableNameToAlias}.*
            FROM ${joinFromAlias}
            JOIN ${joinToAlias} ON 
            ${tableNameToAlias}.${this.colTableTo} = ${tableNameFromAlias}.${this.colTableFrom}`;

    // Add WHERE condition
    query += ` WHERE ${generateJoinConditionWhere(
        tableNameFromAlias,
        this.parent,
        this.parent.primanys
    )}`;
    console.log("many2one query: ", query);
    logger_info(`Executed query: ${query}`);

    let data = await getQueryPromise(query);
    let rs = new classResult();
    Repository.setEntity(rs, data.rows[0]);
    this.valueORM = [rs];
    return [rs];
}

/**
 * Retrieve records in a many-to-many relationship
 * @param {Repository} Repository - The repository instance
 * @returns {Array} - Array of retrieved records
 */
async function getManyToMany(Repository) {
    // Handle self join
    const {
        commonTableName,
        colTableFrom,
        colTableTo,
        colConnectTableFrom,
        colConnectTableTo
    } = this;

    const tableNameFrom = this.parent.tableName;
    const tableNameTo = this.tableNameTo;
    const classResult = this.tableTo;

    let tableNameFromAlias = tableNameFrom + "_1";
    let tableNameToAlias = tableNameTo + "_2";

    let joinFromAlias = `${tableNameFrom} AS ${tableNameFromAlias}`;
    let joinToAlias = `${tableNameTo} AS ${tableNameToAlias}`;

    // Create query
    let query = `
    SELECT ${tableNameToAlias}.*
    FROM ${joinFromAlias}
    JOIN ${commonTableName} ON ${commonTableName}.${colTableFrom} = ${tableNameFromAlias}.${colConnectTableFrom}
    JOIN ${joinToAlias} ON ${commonTableName}.${colTableTo} = ${tableNameToAlias}.${colConnectTableTo}`;
    // Add WHERE condition
    query += ` WHERE ${generateJoinConditionWhere(
        tableNameFromAlias,
        this.parent,
        this.parent.primanys
    )}`;

    console.log("query ManyToMany: ", query);

    let data = await getQueryPromise(query);
    let rsRaw = [];
    let rsORM = [];
    for (let i = 0; i < data.rows.length; i++) {
        rsORM.push(new classResult());
        // rs[i].setData(data.rows[0])
        Repository.setEntity(rsORM[i], data.rows[i]);
        rsRaw.push(data.rows[i][colConnectTableTo]);
    }
    this.valueORM = rsORM;
    this.value = rsRaw;
    logger_info(`Executed query: ${query}`);
    return rsORM;
}

/**
 * Retrieve records in a one-to-many relationship
 * @param {Repository} Repository - The repository instance
 * @returns {Array} - Array of retrieved records
 */
async function getOneToMany(Repository) {
    // Handle self join
    const { colTableFrom, colTableTo } = this;

    const tableNameFrom = this.parent.tableName;
    const tableNameTo = this.tableNameTo;
    const classResult = this.tableTo;

    let tableNameFromAlias = tableNameFrom + "_1";
    let tableNameToAlias = tableNameTo + "_2";

    let joinFromAlias = `${tableNameFrom} AS ${tableNameFromAlias}`;
    let joinToAlias = `${tableNameTo} AS ${tableNameToAlias}`;

    // Create query
    let query = `
    SELECT ${tableNameToAlias}.*
    FROM ${joinFromAlias}
    JOIN ${joinToAlias} ON ${tableNameFromAlias}.${colTableFrom} = ${tableNameToAlias}.${colTableTo}`;
    // Add WHERE condition
    query += ` WHERE ${generateJoinConditionWhere(
        tableNameFromAlias,
        this.parent,
        this.parent.primanys
    )}`;

    let data = await getQueryPromise(query);
    let rsRaw = [];
    let rsORM = [];
    for (let i = 0; i < data.rows.length; i++) {
        rsORM.push(new classResult());
        // rs[i].setData(data.rows[0])
        Repository.setEntity(rsORM[i], data.rows[i]);
        rsRaw.push(data.rows[i][colConnectTableTo]);
    }
    this.valueORM = rsORM;
    this.value = rsRaw;
    logger_info(`Executed query: ${query}`);
    return rsORM;
}

module.exports = {
    getManyToOne,
    getManyToMany,
    getOneToMany
};
