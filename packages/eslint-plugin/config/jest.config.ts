import type {Config} from "jest";

const config: Config = {
    // Stop running tests after `n` failures
    bail: 1,

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
    testPathIgnorePatterns: ["/node_modules/", "<rootDir>/build/"],

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    watchPathIgnorePatterns: ["<rootDir>/build/"],
};

export default config;
