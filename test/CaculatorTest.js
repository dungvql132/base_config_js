const assert = require("chai").assert;
const Calculator = require("../Caculator");

describe("Calculator", function () {
    describe("divide", function () {
        it("should return the quotient of input1 divided by input2", function () {
            const calculator = new Calculator();

            // Test case 1: input1 = 10, input2 = 2
            const result1 = calculator.divide(10, 2);
            assert.equal(
                result1,
                5,
                "Expected quotient of 10 divided by 2 to be 5"
            );

            // Test case 2: input1 = 0, input2 = 5
            const result2 = calculator.divide(0, 5);
            assert.equal(
                result2,
                0,
                "Expected quotient of 0 divided by 5 to be 0"
            );

            // Test case 3: input1 = -8, input2 = 4
            const result3 = calculator.divide(-8, 4);
            assert.equal(
                result3,
                -2,
                "Expected quotient of -8 divided by 4 to be -2"
            );
        });

        it("should throw an error when dividing by zero", function () {
            const calculator = new Calculator();

            // Test case: input1 = 10, input2 = 0
            assert.throws(
                () => calculator.divide(10, 0),
                Error,
                "Divide by zero error"
            );
        });
    });
});
