const { Repository } = require("@src/entity/Repository");
const { findEntity, UserEntity } = require("@src/entity");
const { type } = require("@src/common/entity.common");

/**
 * Standardize the rule condition
 * @param {Object} context - The context object
 * @param {Array} rule - The rule to standardize
 * @param {string} tableName - The name of the table
 * @returns {Array} - The standardized rule
 */
async function standardizedRuleCondition(context, rule, tableName) {
    let [field, condition, value] = rule;

    // Handle value when it is a relation, not a primary value, must start with $user.
    if (typeof value === "string" && value.indexOf("$user.") !== -1) {
        const relationList = value.split(".");
        const userRepository = new Repository(UserEntity);

        // get the user login
        let user = await userRepository.find({
            where: [["username", "=", context.username]]
        });
        let currentObject = user.datas[0];

        // create the query to get the primary value
        for (let i = 1; i < relationList.length - 1; i++) {
            await currentObject[relationList[i]].get(Repository);
            currentObject = currentObject[relationList[i]].valueORM[0];
        }

        // Perform the final execution, if it is in the form of a relation, then a query must be executed to retrieve the value.
        if (
            currentObject[relationList[relationList.length - 1]].type !==
            type.primitive
        ) {
            await currentObject[relationList[relationList.length - 1]].get(
                Repository
            );
        }
        value = currentObject[relationList[relationList.length - 1]].value;
    }

    // Handle field
    if (typeof field === "string" && field.indexOf(".") !== -1 && tableName) {
        let currentValue = typeof value === "object" ? [...value] : [value];
        const relationList = field.split(".");
        const SearchEntityList = [findEntity(tableName)];
        const relationEntityKeyList = [];

        // add item to --SearchEntityList-- and --relationEntityKeyList-- by --relationList--
        for (let i = 0; i < relationList.length - 1; i++) {
            const entityObject = new SearchEntityList[i]();
            Repository.setEntity(entityObject, {});
            SearchEntityList.push(entityObject[relationList[i]].tableTo);
            relationEntityKeyList.push(
                entityObject[relationList[i]].colTableTo
            );
        }

        // for the first time to call the relationList
        if (relationEntityKeyList.length !== 0) {
            // get the information to make query
            currentValue = typeof value === "object" ? [...value] : value;
            const SearchEntity = SearchEntityList.pop();
            const relationEntityKey = relationEntityKeyList.pop();
            const relationEntity = relationList.pop();

            // create a query, in the first time we use the condition in the rule, next time we use key "in"
            const repository = new Repository(SearchEntity);
            const data = await repository.find({
                where: [[relationEntity, condition, currentValue]]
            });

            // reassign the currentValue by the data get from query
            currentValue = data.rawDatas.map(value => value[relationEntityKey]);
        }

        while (relationEntityKeyList.length !== 0) {
            // get the information to make query
            const SearchEntity = SearchEntityList.pop();
            const relationEntityKey = relationEntityKeyList.pop();
            const relationEntity = relationList.pop();

            // create a query, we use key "in"
            const repository = new Repository(SearchEntity);
            const data = await repository.find({
                where: [[relationEntity, "in", currentValue]]
            });

            currentValue = data.rawDatas.map(value => value[relationEntityKey]);
        }
        return [relationList.pop(), "in", currentValue];
    }

    return [field, condition, value];
}

/**
 * Standardize the rules
 * @param {Object} context - The context object
 * @param {Array} rules - The rules to standardize
 * @param {string} tableName - The name of the table
 * @returns {Array} - The standardized rules
 */
async function standardizedRule(context, rules, tableName) {
    const rs = [];
    for (let i = 0; i < rules.length; i++) {
        if (typeof rules[i] === "object") {
            const standardRule = await standardizedRuleCondition(
                context,
                rules[i],
                tableName
            );
            rs.push(standardRule);
        } else {
            rs.push(rules[i]);
        }
    }
    return rs;
}

module.exports = {
    standardizedRule
};
