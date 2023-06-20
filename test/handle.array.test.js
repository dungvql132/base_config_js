require("module-alias/register");
const { expect } = require("chai");
const {
    convertObjectToStringValues,
    convertArrayToSQLValues,
    convertObjectToStringKeysValues,
    generateJoinConditionON,
    generateJoinConditionWhere
} = require("@src/utils/handle.array");

describe("convertObjectToStringValues", () => {
    it("should return the correct string of values for SQL VALUES clause", () => {
        const object = { name: "John", age: 25, city: "New York" };
        const keys = ["name", "age", "city"];
        const result = convertObjectToStringValues(object, keys);
        expect(result).to.equal("'John', '25', 'New York'");
    });

    it("should return the correct string of values for SQL VALUES clause with default keys", () => {
        const object = { name: "John", age: 25, city: "New York" };
        const result = convertObjectToStringValues(object);
        expect(result).to.equal("'John', '25', 'New York'");
    });
});

describe("convertArrayToSQLValues", () => {
    it("should return the correct string of values for SQL WHERE clause using IN", () => {
        const arr = ["John", "Jane", "Doe"];
        const result = convertArrayToSQLValues(arr);
        expect(result).to.equal("('John', 'Jane', 'Doe')");
    });
});

describe("convertObjectToStringKeysValues", () => {
    it("should return the correct string of keys and values for SQL SET clause", () => {
        const object = { name: "John", age: 25, city: "New York" };
        const keys = ["name", "age", "city"];
        const result = convertObjectToStringKeysValues(object, keys);
        expect(result).to.equal("name = 'John', age = '25', city = 'New York'");
    });

    it("should return the correct string of keys and values for SQL SET clause with default keys", () => {
        const object = { name: "John", age: 25, city: "New York" };
        const result = convertObjectToStringKeysValues(object);
        expect(result).to.equal("name = 'John', age = '25', city = 'New York'");
    });
});

describe("generateJoinConditionON", () => {
    it("should return the correct string of join conditions for ON clause in SQL", () => {
        const tableName = "users";
        const commonTableName = "orders";
        const objTable1_keys = ["id", "name"];
        const colTableName_keys = ["user_id", "user_name"];
        const result = generateJoinConditionON(
            tableName,
            commonTableName,
            objTable1_keys,
            colTableName_keys
        );
        expect(result).to.equal(
            "users.id = orders.user_id AND users.name = orders.user_name"
        );
    });
});

describe("generateJoinConditionWhere", () => {
    it("should return the correct string of join conditions for WHERE clause in SQL", () => {
        const tableName = "users";
        const objTable = { id: 1, name: "John" };
        const objTable1_keys = ["id", "name"];
        const result = generateJoinConditionWhere(
            tableName,
            objTable,
            objTable1_keys
        );
        expect(result).to.equal("users.id = '1' AND users.name = 'John'");
    });
});
