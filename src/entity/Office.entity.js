const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class OfficeEntity extends BaseEntity {
    static getTableName = 'office';
    tableName = 'office';
    officecode = {
        value: null,
        type: type.primitive,
        isPrimany: true
    };
    name = {
        value: null,
        type: type.primitive
    };
}

module.exports = {
    OfficeEntity
}