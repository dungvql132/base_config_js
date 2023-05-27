const { getQueryPromise } = require("@src/database/connect");
const { changeTo_whereCondition } = require("@src/utils/rule.condition");
const { fromObjToStringValues, fromObjToStringKeysValues,
     toJoinConditionON, toJoinConditionWhere } = require("@src/utils/handle.array");

class Repository{
    constructor(entity){
        this.entity = entity
    }

    async find(
        option = {
            where: null
        }
    ) {
        // Tạo câu lệnh sql ban đầu
        let query = `select * from ${this.entity.getTableName}`;

        // thêm điều kiện where
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }
        console.log("query: ", query);
        // Trả về giá trị
        let data = await getQueryPromise(query)
        let rs = (data.rows).map((value)=>{
            let obj = new this.entity()
            obj.setData(value)
            return obj
        })
        
        return {
            datas:rs,
            rawDatas:data.rows
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

        // thêm điều kiện where
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }
        console.log('query: ',query);

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
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }

        let data = await getQueryPromise(query)
        return data;
    }
}

module.exports = {
    Repository
}