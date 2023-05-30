const { getQueryPromise } = require("@src/database/connect");
const { changeTo_whereCondition } = require("@src/utils/rule.condition");
const { fromObjToStringValues, fromObjToStringKeysValues } = require("@src/utils/handle.array");
const { Repository, setEntity } = require('@src/entity/Repository')
const { standardizedRule } = require('@src/utils/callDB/standardizedRule')

class RepositoryWithRule extends Repository {
    rules;
    entity;
    user;
    constructor(entity, user) {
        super(entity)
        this.entity = entity
        console.log("entity name: ", entity.getTableName);
        this.user = user
    }

    static setEntity = setEntity

    async setRules() {
        await this.user.group_ids.get(Repository)
        let rules = {}

        const group_ids = this.user.group_ids.valueORM
        for (let i = 0; i < group_ids.length; i++) {
            await group_ids[i].rule_ids.get(Repository)
            rules = group_ids[i].rule_ids.valueORM.reduce((rs, value) => {
                const tablename = value.tablename.value
                const type = value.type.value

                let rule = value.rule.value
                rule = JSON.parse(rule)
                if (tablename === this.entity.getTableName) {
                    if (!rs[type]) {
                        rs[type] = [...rule]
                    } else {
                        rs[type] = ['|', ...rs[type], ...rule]
                    }
                }
                return rs
            }, { ...rules })
        }
        const ruleKeys = Object.keys(rules)
        for (let i = 0; i < ruleKeys.length; i++) {
            rules[ruleKeys[i]] = await standardizedRule(
                { username: this.user.username.value },
                rules[ruleKeys[i]],
                this.entity.getTableName)
        }


        this.rules = rules
    }

    async find(
        option = {
            where: null
        }
    ) {
        // Tạo câu lệnh sql ban đầu
        let query = `select * from ${this.entity.getTableName}`;

        const ruleRead = this.rules['read']


        // thêm điều kiện where
        if (option.where && ruleRead) {
            const whereCondition = changeTo_whereCondition(['&', ...option.where, ...ruleRead]);
            query += ` where ${whereCondition}`;
        } else if (option.where && !ruleRead) {
            const whereCondition = changeTo_whereCondition([...option.where]);
            query += ` where ${whereCondition}`;
        } else if (!option.where && ruleRead) {
            const whereCondition = changeTo_whereCondition([...ruleRead]);
            query += ` where ${whereCondition}`;
        }
        console.log("query: ", query);
        // Trả về giá trị
        let data = await getQueryPromise(query)
        let rs = (data.rows).map((value) => {
            let obj = new this.entity()
            setEntity(obj, value)
            return obj
        })

        return {
            datas: rs,
            rawDatas: data.rows
        };
    }

    async add(...rest) {
        if (rest.length == 0) {
            return
        }

        // lấy danh sách các keys ( field trong database )
        const keys = Object.keys(rest[0])
        let query = `
            INSERT INTO ${this.entity.getTableName} (${keys.join(', ')})
                VALUES `

        const addValueList = []
        rest.forEach(element => {
            addValueList.push(`(${fromObjToStringValues(element, keys)})`)
        })

        // thêm từng values vào trong câu lệnh
        query += addValueList.join(', ')
        console.log("query: ", query);
        let data = await getQueryPromise(query)
        return data;
    }

    async update(
        option = {
            where: null
        },
        newValue
    ) {
        // tạo câu lệnh update ban đầu
        let query = `UPDATE ${this.entity.getTableName}
        SET `;

        // truyền vào set, các tham số sẽ thay đổi
        query += fromObjToStringKeysValues(newValue)

        const ruleRead = this.rules['update']


        // thêm điều kiện where
        if (option.where && ruleRead) {
            const whereCondition = changeTo_whereCondition(['&', ...option.where, ...ruleRead]);
            query += ` where ${whereCondition}`;
        } else if (option.where && !ruleRead) {
            const whereCondition = changeTo_whereCondition([...option.where]);
            query += ` where ${whereCondition}`;
        } else if (!option.where && ruleRead) {
            const whereCondition = changeTo_whereCondition([...ruleRead]);
            query += ` where ${whereCondition}`;
        }
        console.log("query: ", query);

        let data = await getQueryPromise(query)
        return data;
    }

    async delete(
        option = {
            where: null
        }
    ) {
        // tạo câu lệnh delete ban đầu
        let query = `delete from ${this.entity.getTableName}`;

        // thêm điều kiện where
        const ruleRead = this.rules['delete']

        // thêm điều kiện where
        if (option.where && ruleRead) {
            const whereCondition = changeTo_whereCondition(['&', ...option.where, ...ruleRead]);
            query += ` where ${whereCondition}`;
        } else if (option.where && !ruleRead) {
            const whereCondition = changeTo_whereCondition([...option.where]);
            query += ` where ${whereCondition}`;
        } else if (!option.where && ruleRead) {
            const whereCondition = changeTo_whereCondition([...ruleRead]);
            query += ` where ${whereCondition}`;
        }
        console.log("query: ", query);

        let data = await getQueryPromise(query)
        return data;
    }
}

module.exports = {
    RepositoryWithRule
}