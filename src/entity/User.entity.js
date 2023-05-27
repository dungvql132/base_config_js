const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class UserEntity extends BaseEntity{
    static getTableName='users';
    tableName='users';
    username = {
        value: null,
        type: type.primitive,
        isPrimany : true
    };
    password = {
        value: null,
        type: type.primitive
    };
    employeenumber = {
        value: null,
        type: type.many2one,
        tableNameTo : 'employees',
        colTableFrom : 'employeenumber',
        colTableTo : 'employeenumber',
    };
    group_ids = {
        value: null,
        type: type.many2many,
        tableNameTo : 'groups',
        commonTableName : 'groups_users',
        colTableFrom : 'username_key',
        colTableTo : 'group_id',
        colConnectTableFrom : 'username',
        colConnectTableTo : 'id',
    };
}

module.exports = {
    UserEntity
}