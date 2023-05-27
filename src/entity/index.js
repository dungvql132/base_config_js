const { BaseEntity } = require('./Base.entity')
const { CustomerEntity } = require('./Customer.entity')
const { EmployeeEntity } = require('./Employee.entity')
const { GroupEntity } = require('./Group.entity')
// const { } = require('./Office.entity')
const { UserEntity } = require('./User.entity')

module.exports = {
    entities: [BaseEntity, CustomerEntity, EmployeeEntity, GroupEntity, UserEntity]
}