import type {Config} from "jest";

const config: Config = {
    // Stop running tests after `n` failures
    bail: 1,

    // The root directory that Jest should scan for tests and modules within
    rootDir: "../",

    transform: {
        [String.raw`\.tsx?$`]: [
            "ts-jest",
            {
                tsconfig: "<rootDir>/config/tsconfig.test.json",
            },
        ],
    },

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/", "<rootDir>/build/"],

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    watchPathIgnorePatterns: ["<rootDir>/build/"],
};

export default config;
