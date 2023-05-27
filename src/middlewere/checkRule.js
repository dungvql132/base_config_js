const { Repository } = require('@src/entity/Repository')
const { BaseEntity } = require('../entity/Base.entity')
const { EmployeeEntity } = require('@src/entity/Employee.entity')
const { UserEntity } = require('@src/entity/User.entity')

async function checkRule_middlewere(req, res, next) {
    try {
        // console.log("check rule -------------------");
        // const repository = new Repository(EmployeeEntity)
        // let data = await repository.find({
        //     where:[['employeeNumber','=','3']]
        // })
        // await data.datas[0].user_ids.get(UserEntity);
        // await data.datas[0].reportTo.get(EmployeeEntity);

        // console.log(data.datas[0]);
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    checkRule_middlewere
}