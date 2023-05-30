const { BaseEntity } = require('./Base.entity')
const { CustomerEntity } = require('./Customer.entity')
const { EmployeeEntity } = require('./Employee.entity')
const { GroupEntity } = require('./Group.entity')
const { OfficeEntity } = require('./Office.entity')
const { UserEntity } = require('./User.entity')
const { RuleEntity } = require('./Rule.entity')

const entities = [BaseEntity, CustomerEntity, EmployeeEntity, GroupEntity, UserEntity,RuleEntity,OfficeEntity]

function findEntity(tableName){
    for (let i = 0; i < entities.length; i++) {
        if(entities[i].getTableName === tableName){
            return entities[i]
        }
    }
    return BaseEntity
}

module.exports = {
    BaseEntity,
    CustomerEntity,
    EmployeeEntity,
    GroupEntity,
    UserEntity,
    RuleEntity,
    OfficeEntity,
    entities,
    findEntity
}