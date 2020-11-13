// @ts-check

/** @type {import("@jest/types/build/Config").InitialOptionsWithRootDir} */
const config = {
    // A preset that is used as a base for Jest's configuration
    preset: "ts-jest",

    // A set of global variables that need to be available in all test environments
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/config/tsconfig.test.json",
        },
    },

    // The root directory that Jest should scan for tests and modules within
    rootDir: "../",

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/", "<rootDir>/dist/"],
};

module.exports = config;
