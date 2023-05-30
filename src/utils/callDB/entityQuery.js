const { toJoinConditionWhere } = require("@src/utils/handle.array");
const { getQueryPromise } = require("@src/database/connect");

async function getManyToOne(Repository) {
    // xử lý việc self join
    const tableNameFrom = this.parent.tableName
    const tableNameTo = this.tableNameTo

    const classResult = this.tableTo

    let tableNameFromAlias = tableNameFrom + '_1'
    let tableNameToAlias = tableNameTo + '_2'

    let joinFromAlias = `${tableNameFrom} AS ${tableNameFromAlias}`
    let joinToAlias = `${tableNameTo} AS ${tableNameToAlias}`
    // ------------------------------------

    let query = `SELECT ${tableNameToAlias}.*
            FROM ${joinFromAlias}
            JOIN ${joinToAlias} ON 
            ${tableNameToAlias}.${this.colTableTo} = ${tableNameFromAlias}.${this.colTableFrom}`

    // thêm điều kiện where
    query += ` where ${toJoinConditionWhere(tableNameFromAlias, this.parent, this.parent.primanys)}`;
    console.log("many2one query: ",query);

    let data = await getQueryPromise(query)
    let rs = new classResult()
    Repository.setEntity(rs,data.rows[0])
    this.valueORM = [rs]
    return [rs];
}

async function getManyToMany(Repository) {
    // xử lý việc self join
    const { commonTableName, colTableFrom, colTableTo, colConnectTableFrom, colConnectTableTo } = this

    const tableNameFrom = this.parent.tableName
    const tableNameTo = this.tableNameTo
    const classResult = this.tableTo

    let tableNameFromAlias = tableNameFrom + '_1'
    let tableNameToAlias = tableNameTo + '_2'

    let joinFromAlias = `${tableNameFrom} AS ${tableNameFromAlias}`
    let joinToAlias = `${tableNameTo} AS ${tableNameToAlias}`

    // create query
    let query = `
    SELECT ${tableNameToAlias}.*
    FROM ${joinFromAlias}
    JOIN ${commonTableName} ON ${commonTableName}.${colTableFrom} = ${tableNameFromAlias}.${colConnectTableFrom}
    JOIN ${joinToAlias} ON ${commonTableName}.${colTableTo} = ${tableNameToAlias}.${colConnectTableTo}`
    // add query to correct record
    query += ` where ${toJoinConditionWhere(tableNameFromAlias, this.parent, this.parent.primanys)}`;

    console.log("query ManytoMany: ",query);
    
    let data = await getQueryPromise(query)
    let rsRaw = []
    let rsORM = []
    for (let i = 0; i < data.rows.length; i++) {
        rsORM.push(new classResult())
        // rs[i].setData(data.rows[0])
        Repository.setEntity(rsORM[i],data.rows[i])
        rsRaw.push(data.rows[i][colConnectTableTo])
    }
    this.valueORM = rsORM
    this.value = rsRaw
    return rsORM;
}

async function getOneToMany(Repository) {
    // xử lý việc self join
    const { colTableFrom, colTableTo } = this

    const tableNameFrom = this.parent.tableName
    const tableNameTo = this.tableNameTo
    const classResult = this.tableTo

    let tableNameFromAlias = tableNameFrom + '_1'
    let tableNameToAlias = tableNameTo + '_2'

    let joinFromAlias = `${tableNameFrom} AS ${tableNameFromAlias}`
    let joinToAlias = `${tableNameTo} AS ${tableNameToAlias}`

    // create query
    let query = `
    SELECT ${tableNameToAlias}.*
    FROM ${joinFromAlias}
    JOIN ${joinToAlias} ON ${tableNameFromAlias}.${colTableFrom} = ${tableNameToAlias}.${colTableTo}`
    // add query to correct record
    query += ` where ${toJoinConditionWhere(tableNameFromAlias, this.parent, this.parent.primanys)}`;
    
    let data = await getQueryPromise(query)
    let rsRaw = []
    let rsORM = []
    for (let i = 0; i < data.rows.length; i++) {
        rsORM.push(new classResult())
        // rs[i].setData(data.rows[0])
        Repository.setEntity(rsORM[i],data.rows[i])
        rsRaw.push(data.rows[i][colConnectTableTo])
    }
    this.valueORM = rsORM
    this.value = rsRaw
    return rsORM;
}

module.exports = {
    getManyToOne,
    getManyToMany,
    getOneToMany
}