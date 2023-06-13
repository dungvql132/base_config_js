class Calculator {
  divide(input1, input2) {
    const num1 = Number(input1);
    const num2 = Number(input2);

    if (isNaN(num1) || isNaN(num2)) {
      throw new Error("Invalid input. Please provide valid numbers.");
    }

    if (num2 === 0) {
      throw new Error("Divide by zero error");
    }

    return num1 / num2;
  }
}

module.exports = Calculator;
