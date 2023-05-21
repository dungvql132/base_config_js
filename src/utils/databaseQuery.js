const { getQueryPromise } = require("@src/database/connect");
const { changeTo_whereCondition } = require("./rule.condition");

class RepositoryPostSQL {
    tableName = "";
    constructor(tableName) {
        this.tableName = tableName;
    }

    find(
        option = {
            where: null
        }
    ) {
        let query = `select * from ${this.tableName}`;
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }
        console.log(query);
        return getQueryPromise(query);
    }
}

const repository = new RepositoryPostSQL("users");
repository.find({ where: [["id", "=", 1]] }).then(data => {
    console.log(data.rows);
});
