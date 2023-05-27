const { toJoinConditionWhere } = require("@src/utils/handle.array");
const { getQueryPromise } = require("@src/database/connect");

async function getManyToOne(ConvertEntity) {
    // xử lý việc self join
    const tableNameFrom = this.parent.tableName
    const tableNameTo = this.tableNameTo

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

    let data = await getQueryPromise(query)
    let rs = new ConvertEntity()
    rs.setData(data.rows[0])
    this.valueORM = rs
    return rs;
}

async function getManyToMany(ConvertEntity) {
    // xử lý việc self join
    const { commonTableName, colTableFrom, colTableTo, colConnectTableFrom, colConnectTableTo } = this

    const tableNameFrom = this.parent.tableName
    const tableNameTo = this.tableNameTo

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
    
    let data = await getQueryPromise(query)
    let rs = []
    for (let i = 0; i < data.rows.length; i++) {
        rs.push(new ConvertEntity())
        rs[i].setData(data.rows[0])
    }
    this.valueORM = rs
    return rs;
}

async function getOneToMany(ConvertEntity) {
    // xử lý việc self join
    const { colTableFrom, colTableTo } = this
    console.log("this: ", this);

    const tableNameFrom = this.parent.tableName
    const tableNameTo = this.tableNameTo

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
    let rs = []
    for (let i = 0; i < data.rows.length; i++) {
        rs.push(new ConvertEntity())
        rs[i].setData(data.rows[0])
    }
    this.valueORM = rs
    return rs;
}

module.exports = {
    getManyToOne,
    getManyToMany,
    getOneToMany
}