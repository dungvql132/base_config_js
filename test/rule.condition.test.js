require("module-alias/register");
const { expect } = require("chai");
const { convertToWhereCondition } = require("@src/utils/rule.condition");

describe("convertToWhereCondition", () => {
    it("should return undefined for invalid input", () => {
        const result = convertToWhereCondition([]);
        expect(result).to.be.undefined;
    });

    it("should return the correct SQL WHERE condition for a single condition", () => {
        const input = [["name", "=", "John"]];
        const result = convertToWhereCondition(input);
        expect(result).to.equal("name = 'John'");
    });

    it('should return the correct SQL WHERE condition for multiple conditions with "AND" operator', () => {
        const input = ["&", ["name", "=", "John"], ["age", ">", 18]];
        const result = convertToWhereCondition(input);
        expect(result).to.equal("(name = 'John' AND age > '18')");
    });

    it('should return the correct SQL WHERE condition for multiple conditions with "OR" operator', () => {
        const input = ["|", ["name", "=", "John"], ["name", "=", "Jane"]];
        const result = convertToWhereCondition(input);
        expect(result).to.equal("(name = 'John' OR name = 'Jane')");
    });

    it("should handle nested conditions", () => {
        const input = [
            "&",
            ["name", "=", "John"],
            "|",
            ["age", ">", 18],
            ["age", "<", 30]
        ];
        const result = convertToWhereCondition(input);
        console.log("result: ", result);
        expect(result).to.equal(
            "(name = 'John' AND (age > '18' OR age < '30'))"
        );
    });
});
