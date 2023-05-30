const { getQueryPromise } = require("@src/database/connect");
const { changeTo_whereCondition } = require("@src/utils/rule.condition");
const { fromObjToStringValues, fromObjToStringKeysValues } = require("@src/utils/handle.array");
const { findEntity } = require("@src/entity");
const { getManyToOne, getManyToMany, getOneToMany } = require("@src/utils/callDB/entityQuery")
const { type } = require('@src/common/entity.common')

class Repository {
    constructor(entity) {
        this.entity = entity
    }

    static setEntity = setEntity

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
        let rs = (data.rows).map((value) => {
            let obj = new this.entity()
            setEntity(obj,value)
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

        // thêm điều kiện where
        if (option.where) {
            const whereCondition = changeTo_whereCondition(option.where);
            query += ` where ${whereCondition}`;
        }
        console.log('query: ', query);

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

function setEntity(entityObject, data) {
    let primanys = []
    Object.keys(entityObject).forEach(key => {
        if (entityObject[key].type && (entityObject[key].type == type.primitive || entityObject[key].type == type.many2one)) {
            entityObject[key].value = data[key.toLocaleLowerCase()]
        }

        if (entityObject[key].isPrimany) {
            primanys.push(key)
        }

        if (typeof entityObject[key] === 'object') {
            entityObject[key]['parent'] = entityObject
        }

        if(entityObject[key].type == type.many2one){
            entityObject[key]['get'] = getManyToOne
            entityObject[key]['tableTo'] = findEntity(entityObject[key].tableNameTo)
        }

        if(entityObject[key].type == type.many2many){
            entityObject[key]['get'] = getManyToMany
            entityObject[key]['tableTo'] = findEntity(entityObject[key].tableNameTo)
        }

        if(entityObject[key].type == type.one2many){
            entityObject[key]['get'] = getOneToMany
            entityObject[key]['tableTo'] = findEntity(entityObject[key].tableNameTo)
        }
    });


    entityObject.primanys = primanys
    return entityObject
}

function isEqualEntity(entity_1,entity_2){

}

function isEntityinList(entity, entityList) {
    
}

module.exports = {
    Repository,
    setEntity
}