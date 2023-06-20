const { convertArrayToSQLValues } = require("./handle.array");

/**
 * Merge two SQL WHERE conditions
 * @param {string} command_1 - The first SQL WHERE condition
 * @param {string} command_2 - The second SQL WHERE condition
 * @param {string} condition - The condition to merge the two conditions ('AND' or 'OR')
 * @returns {string} - The merged SQL WHERE condition
 */
function mergeWhereConditions(command_1, command_2, condition) {
    let result = `(${command_1} ${
        condition === "|" ? "OR" : "AND"
    } ${command_2})`;
    if (command_2 === undefined) {
        result = command_1;
    }
    console.log("the result: ", result);
    return result;
}

/**
 * Convert an array to a string for SQL WHERE condition
 * @param {Array} arr - The array representing the SQL WHERE condition
 * @returns {string} - The SQL WHERE condition string
 */
function arrayToWhereCondition(arr) {
    const [field, condition, value] = arr;
    let result = `${field} ${condition} ${value}`;
    if (`${value}`.toLowerCase() !== "null") {
        if (condition.toLowerCase() === "in") {
            result = `${field} ${condition} ${convertArrayToSQLValues(value)}`;
        }
        result = `${field} ${condition} '${value}'`;
    }
    return result;
}

/**
 * Convert an array of conditions to a string for SQL WHERE condition
 * @param {Array} arr - The array of conditions
 * @returns {string|undefined} - The SQL WHERE condition string, or undefined if the input is invalid
 */
function convertToWhereCondition(arr) {
    const signs = [];
    const commands = [];
    const result = [];

    for (let i = arr.length - 1; i >= 0; i--) {
        if (typeof arr[i] === "object") {
            commands.push(arrayToWhereCondition(arr[i]));
        } else {
            signs.push(arr[i]);
        }

        if (commands.length >= 2 && signs.length >= 1) {
            const command_1 = commands.pop();
            const command_2 = commands.pop();
            const sign = signs.pop();
            result.push(mergeWhereConditions(command_1, command_2, sign));
        } else if (commands.length >= 1 && signs.length >= 1) {
            const command_1 = commands.pop();
            const command_2 = result.pop();
            const sign = signs.pop();
            result.push(mergeWhereConditions(command_1, command_2, sign));
        } else if (result.length >= 2 && signs.length >= 1) {
            const command_1 = result.pop();
            const command_2 = result.pop();
            const sign = signs.pop();
            result.push(mergeWhereConditions(command_1, command_2, sign));
        }
    }

    if (result.length === 0 && commands.length === 1) {
        return commands[0];
    }

    if (signs.length !== 0 || commands.length !== 0 || result.length !== 1) {
        return undefined;
    }

    return `${result[0]}`;
}

module.exports = {
    convertToWhereCondition
};
