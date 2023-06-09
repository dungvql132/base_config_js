function commandTo_whereCondition(command_1, command_2, condition) {
    if (command_2 === undefined) {
        return command_1;
    }
    const rs = `(${command_1} ${condition == "|" ? "OR" : "AND"} ${command_2})`;
    return rs;
}

function arrayTo_where_condition([field, condition, value]) {
    return `${field} ${condition} '${value}'`;
}

function changeTo_whereCondition(arr) {
    const signs = [];
    const commands = [];
    const rs = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        if (typeof arr[i] === "object") {
            commands.push(arrayTo_where_condition(arr[i]));
        } else {
            signs.push(arr[i]);
        }
        if (commands.length >= 2 && signs.length >= 1) {
            const command_1 = commands.pop();
            const command_2 = commands.pop();
            const sign = signs.pop();
            rs.push(towhereCondition(command_1, command_2, sign));
        } else if (commands.length >= 1 && signs.length >= 1) {
            const command_1 = commands.pop();
            const command_2 = rs.pop();
            const sign = signs.pop();
            rs.push(towhereCondition(command_1, command_2, sign));
        } else if (rs.length >= 2 && signs.length >= 1) {
            const command_1 = rs.pop();
            const command_2 = rs.pop();
            const sign = signs.pop();
            rs.push(towhereCondition(command_1, command_2, sign));
        }
    }
    if (rs.length == 0 && commands.length == 1) {
        return commands[0];
    }
    if (signs.length != 0 || commands.length != 0 || rs.length != 1) {
        return;
    }
    return rs[0];
}

module.exports = {
    changeTo_whereCondition
};
