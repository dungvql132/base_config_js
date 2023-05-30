const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class EmployeeEntity extends BaseEntity {
    static getTableName = 'employees';
    tableName = 'employees';
    employeenumber = {
        value: null,
        type: type.primitive,
        isPrimany: true
    };
    lastname = {
        value: null,
        type: type.primitive
    };
    firstname = {
        value: null,
        type: type.primitive
    };
    extension = {
        value: null,
        type: type.primitive
    };
    email = {
        value: null,
        type: type.primitive
    };
    officecode = {
        value: null,
        type: type.many2one,
        tableNameTo: 'offices',
        colTableFrom: 'officecode',
        colTableTo: 'officecode',
    };
    reportto = {
        value: null,
        type: type.many2one,
        tableNameTo: 'employees',
        colTableFrom: 'reportto',
        colTableTo: 'employeenumber',
    };
    jobtitle = {
        value: null,
        type: type.primitive
    };
    user_ids = {
        value: null,
        type: type.one2many,
        tableNameTo: 'users',
        colTableFrom: 'employeenumber',
        colTableTo: 'employeenumber',
        colConnectTableTo: 'username',
    };
}

module.exports = {
    EmployeeEntity
}