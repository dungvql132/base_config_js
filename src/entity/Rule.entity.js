const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class RuleEntity extends BaseEntity{
    static getTableName='rules';
    tableName='rules';
    id = {
        value: null,
        type: type.primitive,
        isPrimany : true
    };
    rule = {
        value: null,
        type: type.primitive
    };
    type = {
        value: null,
        type: type.primitive
    };
    tablename = {
        value: null,
        type: type.primitive
    };
    group_ids = {
        value: null,
        type: type.many2many,
        tableNameTo : 'groups',
        commonTableName : 'groups_rules',
        colTableFrom : 'rule_id',
        colTableTo : 'group_id',
        colConnectTableFrom : 'id',
        colConnectTableTo : 'id',
    };
}

module.exports = {
    RuleEntity
}