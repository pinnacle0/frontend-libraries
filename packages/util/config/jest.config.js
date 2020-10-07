// @ts-check

/** @type {import("@jest/types/build/Config").InitialOptionsWithRootDir} */
const config = {
    // An array of file extensions your modules use
    moduleFileExtensions: ["ts", "tsx", "js"],

    // The regexp pattern or array of patterns that Jest uses to detect test files
    testRegex: [String.raw`.*/.+\.test\.(ts|tsx)?$`],

    // A preset that is used as a base for Jest's configuration
    preset: "ts-jest",

    // A set of global variables that need to be available in all test environments
    globals: {
        "ts-jest": {
            tsConfig: "./config/tsconfig.json",
        },
    },

    // A map from regular expressions to paths to transformers
    transform: {
        [String.raw`^.+\.tsx?$`]: "ts-jest",
    },

    // The root directory that Jest should scan for tests and modules within
    rootDir: "..",

    // A list of paths to directories that Jest should use to search for files in
    roots: ["<rootDir>/test"],

    // The test environment that will be used for testing
    testEnvironment: "node",

    // Indicates whether each individual test should be reported during the run
    verbose: true,

    // All imported modules in your tests should be mocked automatically
    automock: false,

    // Automatically clear mock calls and instances between every test
    clearMocks: true,
};

module.exports = config;
