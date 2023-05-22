const { getQueryPromise } = require("@src/database/connect");
const { changeTo_whereCondition } = require("./rule.condition");
const { fromObjToStringValues, fromObjToStringKeysValues } = require("./handle.array");

class RepositoryPostSQL {
    // tên bảng trong database
    tableName = "";
    constructor(tableName) {
        this.tableName = tableName;
    }

    async find(
        option = {
            where: null
        }
    ) {
        // Tạo câu lệnh sql ban đầu
        let query = `select * from ${this.tableName}`;

        // thêm điều kiện where
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }

        // Trả về giá trị
        let data = await getQueryPromise(query)
        return data.rows;
    }

    async add(...rest) {
        if (rest.length == 0) {
            return
        }

        // lấy danh sách các keys ( field trong database )
        const keys = Object.keys(rest[0])
        let query = `
            INSERT INTO ${this.tableName} (${keys.join(', ')})
                VALUES `

        const addValueList = []
        rest.forEach(element => {
            addValueList.push(`(${fromObjToStringValues(element, keys)})`)
        })

        // thêm từng values vào trong câu lệnh
        query += addValueList.join(', ')
        console.log(query);
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
        let query = `UPDATE ${this.tableName}
        SET `;

        // truyền vào set, các tham số sẽ thay đổi
        query += fromObjToStringKeysValues(newValue)

        // thêm điều kiện where
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }

        let data = await getQueryPromise(query)
        return data;
    }

    async delete(
        option = {
            where: null
        }
    ) {
        // tạo câu lệnh delete ban đầu
        let query = `delete from ${this.tableName}`;

        // thêm điều kiện where
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }

        let data = await getQueryPromise(query)
        return data;
    }

    async getManyToMany(
        objTable1 = {
            id: null
        },
        tableName2,
        commonTableName,
        colTableName1,
        colTableName2) {

        // lấy list của bảng 2 trong quan hệ n-n
        // tạo câu lệnh join
        let query = `SELECT ${tableName2}.*
            FROM ${this.tableName}
            JOIN ${commonTableName} ON ${this.tableName}.id = ${commonTableName}.${colTableName1}
            JOIN ${tableName2} ON ${tableName2}.id = ${commonTableName}.${colTableName2}`

        // thêm điều kiện where
        query += ` where ${this.tableName}.id=${objTable1.id}`;


        let data = await getQueryPromise(query)
        return data.rows;
    }

    async getOneToMany(
        objTable1 = {
            id: null
        },
        tableName2,
        colTableName2) {

        // lấy list của bảng 2 trong quan hệ One2Many
        // tạo câu lệnh join
        let query = `SELECT ${tableName2}.*
            FROM ${this.tableName}
            JOIN ${tableName2} ON ${this.tableName}.id = ${tableName2}.${colTableName2}`

        // thêm điều kiện where
        query += ` where ${this.tableName}.id=${objTable1.id}`;

        let data = await getQueryPromise(query)
        return data.rows;
    }

    async getManyToOne(
        objTable1 = {
            id: null
        },
        colTableName1,
        tableName2) {
        // lấy object của bảng 2 trong quan hệ One2Many
        // tạo câu lệnh join
        let query = `SELECT ${tableName2}.*
            FROM ${this.tableName}
            JOIN ${tableName2} ON ${tableName2}.id = ${this.tableName}.${colTableName1}`

        // thêm điều kiện where
        query += ` where ${this.tableName}.id=${objTable1.id}`;

        let data = await getQueryPromise(query)
        return data.rows[0];
    }
}

// const repository = new RepositoryPostSQL("users");
// repository.delete({ where: [["id", "=", 5]] }).then(data => {
//     console.log(data);
// });

// repository.update({ where: [["id", "=", 6]] },{'name':"dung"}).then(data => {
//     console.log(data);
// });
// repository.add(
//     {
//         name: "dung", email: "dungvq123@gmail.com", password: "123456"
//     },
//     {
//         name: "lan", email: "dung@gmail.com", password: "123456"
//     },
// ).then(data => {
//     console.log(data);
// })


// repository.getManyToMany({ id: 1 }, 'groups', 'user_group', 'user_id', 'group_id').then(data => {
//     console.log(data);
// });

// repository.getOneToMany({ id: 1 }, 'books','author_id').then(data => {
//     console.log(data);
// });

// const repositoryBook = new RepositoryPostSQL("books");

// repositoryBook.getManyToOne({id:1},'author_id','users').then(data => {
//     console.log(data);
// });