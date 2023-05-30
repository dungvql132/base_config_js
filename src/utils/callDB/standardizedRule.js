const { Repository } = require('@src/entity/Repository')
const { findEntity, UserEntity } = require('@src/entity')
const { type } = require('@src/common/entity.common')

async function standardizedRuleCondition({ username }, [field, condition, value], tableName) {
    // handle value
    if (typeof value === 'string' && value.indexOf('$user.') !== -1) {
        const relationList = value.split('.')
        const userRepository = new Repository(UserEntity)

        let user = await userRepository.find(
            {
                where: [['username', '=', username]]
            }
        )
        let currentObject = user.datas[0]
        for (let i = 1; i < relationList.length - 1; i++) {
            await currentObject[relationList[i]].get(Repository)
            currentObject = currentObject[relationList[i]].valueORM[0]
        }
        if (currentObject[relationList[relationList.length - 1]].type != type.primitive) {
            await currentObject[relationList[relationList.length - 1]].get(Repository)
        }
        value = currentObject[relationList[relationList.length - 1]].value
    }

    // handle value
    if (typeof field === 'string' && field.indexOf('.') !== -1 && tableName) {
        let currentValue = typeof value === 'object' ? [...value] : [value]
        const relationList = field.split('.')
        const SearchEntityList = [findEntity(tableName)]
        const relationEntityKeyList = []
        for (let i = 0; i < relationList.length - 1; i++) {
            const entityObject = new (SearchEntityList[i])()
            Repository.setEntity(entityObject, {})
            SearchEntityList.push(entityObject[relationList[i]].tableTo)
            relationEntityKeyList.push(entityObject[relationList[i]].colTableTo)
        }

        while (relationEntityKeyList.length != 0) {
            const SearchEntity = SearchEntityList.pop()
            const relationEntityKey = relationEntityKeyList.pop()
            const relationEntity = relationList.pop()

            const repository = new Repository(SearchEntity)
            const data = await repository.find({
                where: [[relationEntity, 'in', currentValue]]
            })

            currentValue = data.rawDatas.map((value) => {
                return value[relationEntityKey]
            })
        }
        return [relationList.pop(), 'in', currentValue]
    }

    return [field, condition, value]
}

async function standardizedRule({ username }, rules, tableName) {
    const rs = []
    for (let i = 0; i < rules.length; i++) {
        if (typeof rules[i] === 'object') {
            const standardRule = await standardizedRuleCondition({ username }, rules[i], tableName)
            rs.push(standardRule)
        }
        else {
            rs.push(rules[i])
        }
    }
    return rs
}

module.exports = {
    standardizedRule
}