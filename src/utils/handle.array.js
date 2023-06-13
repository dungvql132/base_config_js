// Convert an object to a string of values for SQL VALUES clause
/**
 *
 * @param {object} object
 * @param {Array} keys
 * @returns
 */
function convertObjectToStringValues(object, keys) {
    if (!keys) {
        keys = Object.keys(object);
    }

    let values = keys.map(key => {
        const value = object[key];
        if (`${value}`.toLowerCase() !== "null") {
            return `'${value}'`;
        } else {
            return `${value}`;
        }
    });

    return `${values.join(", ")}`;
}

/**
 *
 * @param {Array} arr
 * @returns {string}
 */
// Convert an array to a string of values for SQL WHERE clause using IN
function convertArrayToSQLValues(arr) {
    const values = arr.map(value => {
        if (`${value}`.toLowerCase() === "null") {
            return value;
        } else {
            return `'${value}'`;
        }
    });

    return `(${values.join(", ")})`;
}

/**
 *
 * @param {object} object
 * @param {Array} keys
 * @returns
 */
// Convert an object to a string of keys and values for SQL SET clause
function convertObjectToStringKeysValues(object, keys) {
    if (!keys) {
        keys = Object.keys(object);
    }

    let keyValuePairs = keys.map(key => {
        const value = object[key];
        if (`${value}`.toLowerCase() === "null") {
            return `${key} = ${value}`;
        } else {
            return `${key} = '${value}'`;
        }
    });

    return keyValuePairs.join(", ");
}

// Generate a string of join conditions for ON clause in SQL
/**
 *
 * @param {string} tableName
 * @param {string} commonTableName
 * @param {Array} objTable1_keys
 * @param {Array} colTableName_keys
 * @returns
 */
function generateJoinConditionON(
    tableName,
    commonTableName,
    objTable1_keys,
    colTableName_keys
) {
    let conditions = objTable1_keys.map((key, index) => {
        return `${tableName}.${objTable1_keys[index]} = ${commonTableName}.${colTableName_keys[index]}`;
    });

    return conditions.join(" AND ");
}

// Generate a string of join conditions for WHERE clause in SQL
/**
 *
 * @param {string} tableName
 * @param {object} objTable
 * @param {Array} objTable1_keys
 * @returns
 */
function generateJoinConditionWhere(tableName, objTable, objTable1_keys) {
    let conditions = objTable1_keys.map((key, index) => {
        if (typeof objTable[key] === "object") {
            return `${tableName}.${key} = '${objTable[key].value}'`;
        } else {
            return `${tableName}.${key} = '${objTable[key]}'`;
        }
    });

    return conditions.join(" AND ");
}

module.exports = {
    convertObjectToStringValues,
    convertObjectToStringKeysValues,
    convertArrayToSQLValues,
    generateJoinConditionON,
    generateJoinConditionWhere
};
