const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class EmployeeEntity extends BaseEntity {
    static getTableName = 'employees';
    tableName = 'employees';
    employeeNumber = {
        value: null,
        type: type.primitive,
        isPrimany: true
    };
    lastName = {
        value: null,
        type: type.primitive
    };
    firstName = {
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
    // officeCode VARCHAR(255),
    // FOREIGN KEY (officeCode) REFERENCES offices(officeCode) ON DELETE CASCADE
    reportTo = {
        value: null,
        type: type.many2one,
        tableNameTo: 'employees',
        colTableFrom: 'employeeNumber',
        colTableTo: 'employeenumber',
    };
    jobTitle = {
        value: null,
        type: type.primitive
    };
    user_ids = {
        value: null,
        type: type.one2many,
        tableNameTo: 'users',
        colTableFrom: 'employeenumber',
        colTableTo: 'employeenumber'
    };
}

module.exports = {
    EmployeeEntity
}