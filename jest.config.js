require("module-alias/register");

module.exports = {
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverageFrom: ["**/*.js"],
    testMatch: ["**/*.test.js"]
};
