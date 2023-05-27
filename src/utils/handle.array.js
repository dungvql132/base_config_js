// change from object to a string
// change it to use from object to SQL VALUES
function fromObjToStringValues(object, keys) {
    if (!keys) {
        keys = Object.keys(object)
    }

    let rs = []
    keys.forEach(key => {
        if (`${object[key]}`.toLocaleLowerCase() != 'null') rs.push(`'${object[key]}'`)
        else rs.push(`${object[key]}`)
    });
    return rs.join(', ')
}
// ( {x:1,y:2}, ['x','y'] )=> ('1','2')

// change from array to a string
// change it to use from array to use IN in SQL WHERE
function fromArrayToArraySQL(arr) {
    const arrString = arr.map((value) => {
        if (`${value}`.toLocaleLowerCase() == 'null') {
            return value
        }
        return `'${value}'`
    })

    return `(${arrString.join(', ')})`
}

// [1,2,3] => ('1','2','3')

// change from object to a string
// change it to use from object to SQL SET
function fromObjToStringKeysValues(object, keys) {
    if (!keys) {
        keys = Object.keys(object)
    }

    let rs = []
    keys.forEach(key => {
        rs.push(`${key} = '${object[key]}'`)
    });
    return rs.join(', ')
}
// ( {x:1,y:2}, ['x','y'] )=> (x = '1',y = '2')

// result is string, use in ON CONDITION
// this use for a where have multi table
function toJoinConditionON(tableName,commonTableName,objTable1_keys,colTableName_keys){
    let rs = objTable1_keys.map((value,index)=>{
        return `${tableName}.${objTable1_keys[index]} = ${commonTableName}.${colTableName_keys[index]}`
    })

    return rs.join(' AND ')
}

// result is string, use in WHERE CONDITION
// this use for a where have multi table
function toJoinConditionWhere(tableName,objTable,objTable1_keys){
    let rs =  objTable1_keys.map((value,index)=>{
        if(typeof objTable[value] === 'object')    return `${tableName}.${value} = '${objTable[value].value}'`
        return `${tableName}.${value} = '${objTable[value]}'`
    })

    return rs.join(' AND ')
}

module.exports = {
    fromObjToStringValues,
    fromObjToStringKeysValues,
    fromArrayToArraySQL,
    toJoinConditionON,
    toJoinConditionWhere
}