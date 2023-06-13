require("module-alias/register");
const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
const {
    convertObjectToStringValues,
    convertArrayToSQLValues
} = require("@src/utils/handle.array");

describe("convertObjectToStringValues", () => {
    it("should convert object to string of values", () => {
        const object = {
            id: 1,
            name: "John",
            age: 30
        };
        const keys = ["id", "name", "age"];

        const result = convertObjectToStringValues(object, keys);
        const expected = "1, 'John', 30";

        assert.strictEqual(result, expected);
    });

    it("should handle null values correctly", () => {
        const object = {
            id: 1,
            name: null,
            age: 30
        };

        const result = convertObjectToStringValues(object);
        const expected = "1, null, 30";

        assert.strictEqual(result, expected);
    });

    it("should handle missing keys", () => {
        const object = {
            id: 1,
            name: "John",
            age: 30
        };
        const keys = ["id", "name"];

        const result = convertObjectToStringValues(object, keys);
        const expected = "1, 'John'";

        expect(result).to.equal(expected);
    });
});

describe("convertArrayToSQLValues", () => {
    it("should convert array to string of values for SQL WHERE clause", () => {
        const arr = [1, "John", 30];
        const result = convertArrayToSQLValues(arr);
        const expected = "(1, 'John', 30)";

        assert.strictEqual(result, expected);
    });

    it("should handle null values correctly", () => {
        const arr = [1, null, 30];
        const result = convertArrayToSQLValues(arr);
        const expected = "(1, null, 30)";

        assert.strictEqual(result, expected);
    });

    it("should handle empty array", () => {
        const arr = [];
        const result = convertArrayToSQLValues(arr);
        const expected = "()";

        expect(result).to.equal(expected);
    });
});
