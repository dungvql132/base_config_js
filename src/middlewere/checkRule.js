const { Repository } = require('@src/entity/Repository')
const { RepositoryWithRule } = require('@src/entity/RepositoryWithRule')
const { findEntity, EmployeeEntity, UserEntity,CustomerEntity } = require('@src/entity')
const { standardizedRule } = require('@src/utils/callDB/standardizedRule')

async function checkRule_middlewere(req, res, next) {
    try {
        // console.log("check rule -------------------");
        // console.log(req.body.user);
        // let rules = await standardizedRule(req.body.user, 
        //     [["salesrepemployeenumber.officecode", "=", "$user.employeenumber.officecode"]],
        //     CustomerEntity.getTableName)
        // console.log('rules: ',rules);
        // const repository = new Repository(UserEntity)
        // let data = await repository.find({
        //     where:rules
        // })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        // console.log(data.rawDatas);
        // const data = await repository.find({
        //     where: [['username', '=', req.body.user.username]]
        // })
        // const user = data.datas[0]

        // const empRepository = new RepositoryWithRule(EmployeeEntity,user)
        // await empRepository.setRules()

        // const data1 = await empRepository.find()
        // console.log('data1.rawDatas : ',data1.rawDatas);
        

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    checkRule_middlewere
}