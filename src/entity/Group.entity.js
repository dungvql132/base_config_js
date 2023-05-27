const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class GroupEntity extends BaseEntity{
    static getTableName='groups';
    tableName='groups';
    id = {
        value: null,
        type: type.primitive,
        isPrimany : true
    };
    name = {
        value: null,
        type: type.primitive
    };
    user_ids = {
        value: null,
        type: type.many2many,
        tableNameTo : 'users',
        commonTableName : 'groups_users',
        colTableFrom : 'group_id',
        colTableTo : 'username_key',
        colConnectTableFrom : 'id',
        colConnectTableTo : 'username',
    };
}

module.exports = {
    GroupEntity
}