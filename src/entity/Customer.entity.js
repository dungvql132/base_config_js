const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class CustomerEntity extends BaseEntity {
    static getTableName = 'customers';
    tableName = 'customers';
    customerNumber = {
        value: null,
        type: type.primitive,
        isPrimany: true
    };
    customerName = {
        value: null,
        type: type.primitive
    };
    contactFirstName = {
        value: null,
        type: type.primitive
    };
    contactLastName = {
        value: null,
        type: type.primitive
    };
    phone = {
        value: null,
        type: type.primitive
    };
    addressLine1 = {
        value: null,
        type: type.primitive
    };
    addressLine2 = {
        value: null,
        type: type.primitive
    };
    city = {
        value: null,
        type: type.primitive
    };
    state = {
        value: null,
        type: type.primitive
    };
    postalCode = {
        value: null,
        type: type.primitive
    };
    country = {
        value: null,
        type: type.primitive
    };
    salesRepEmployeeNumber = {
        value: null,
        type: type.many2one,
        tableNameTo: 'employees',
        colTableFrom: 'salesRepEmployeeNumber',
        colTableTo: 'employeeNumber',
    };
    creditLimit = {
        value: null,
        type: type.primitive
    };
}

module.exports = {
    CustomerEntity
}