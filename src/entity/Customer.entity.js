const { type } = require('@src/common/entity.common')
const { BaseEntity } = require('./Base.entity')

class CustomerEntity extends BaseEntity {
    static getTableName = 'customers';
    tableName = 'customers';
    customernumber = {
        value: null,
        type: type.primitive,
        isPrimany: true
    };
    customername = {
        value: null,
        type: type.primitive
    };
    contactfirstname = {
        value: null,
        type: type.primitive
    };
    contactlastname = {
        value: null,
        type: type.primitive
    };
    phone = {
        value: null,
        type: type.primitive
    };
    addressline1 = {
        value: null,
        type: type.primitive
    };
    addressline2 = {
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
    postalcode = {
        value: null,
        type: type.primitive
    };
    country = {
        value: null,
        type: type.primitive
    };
    salesrepemployeenumber = {
        value: null,
        type: type.many2one,
        tableNameTo: 'employees',
        colTableFrom: 'salesrepemployeenumber',
        colTableTo: 'employeenumber',
    };
    creditlimit = {
        value: null,
        type: type.primitive
    };
}

module.exports = {
    CustomerEntity
}