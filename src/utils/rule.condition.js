const { fromArrayToArraySQL } = require('./handle.array')

// merge 2 SQL WHERE CONDITION 
function merge_2_whereCondition(command_1, command_2, condition) {
    if (command_2 === undefined) {
        return command_1;
    }
    const rs = `(${command_1} ${condition == "|" ? "OR" : "AND"} ${command_2})`;
    return rs;
}

// (user = '1' , user = '2', '|') => user = '1' OR user = '2'

// change it from array we define to the string use in SQL WHERE CONDITION
function arrayTo_whereCondition([field, condition, value]) {
    if (`${value}`.toLocaleLowerCase() != 'null') {
        if (condition.toLocaleLowerCase() == 'in') {
            return `${field} ${condition} ${fromArrayToArraySQL(value)}`
        }
        return `${field} ${condition} '${value}'`;
    }
    return `${field} ${condition} ${value}`;
}
// ['user','=',1] => user = '1'  or ['user','in',[1,2,3]] => user in ('1','2','3')



function changeTo_whereCondition(arr) {
    // a stack store the signs in the arr
    const signs = [];

    // a stack store the commands in the arr
    const commands = [];

    // a stack store the result, to the last this with be have an element only
    const rs = [];

    // loop the arr from last to start
    for (let i = arr.length - 1; i >= 0; i--) {
        // push the command or the sign to there stack
        if (typeof arr[i] === "object") {
            commands.push(arrayTo_whereCondition(arr[i]));
        } else {
            signs.push(arr[i]);
        }

        // take the command or signs or result to merge them together if they are eligible
        if (commands.length >= 2 && signs.length >= 1) {
            const command_1 = commands.pop();
            const command_2 = commands.pop();
            const sign = signs.pop();
            rs.push(merge_2_whereCondition(command_1, command_2, sign));
        } else if (commands.length >= 1 && signs.length >= 1) {
            const command_1 = commands.pop();
            const command_2 = rs.pop();
            const sign = signs.pop();
            rs.push(merge_2_whereCondition(command_1, command_2, sign));
        } else if (rs.length >= 2 && signs.length >= 1) {
            const command_1 = rs.pop();
            const command_2 = rs.pop();
            const sign = signs.pop();
            rs.push(merge_2_whereCondition(command_1, command_2, sign));
        }
    }

    // if there is one commands in the arr, return that commands
    if (rs.length == 0 && commands.length == 1) {
        return commands[0];
    }

    // in the last, the results have 1 element, signs and commands has 0 element
    // if not like that, the array in the params use incorrect form
    if (signs.length != 0 || commands.length != 0 || rs.length != 1) {
        return;
    }
    return rs[0];
}

module.exports = {
    changeTo_whereCondition
};
