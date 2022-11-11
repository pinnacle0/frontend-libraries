import type {Config} from "jest";

const config: Config = {
    // An array of file extensions your modules use
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

    // The regexp pattern or array of patterns that Jest uses to detect test files
    testRegex: [String.raw`.*/.+\.test\.(ts|tsx)$`],

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/", "<rootDir>/build/"],

    // A map from regular expressions to paths to transformers
    transform: {
        [String.raw`^.+\.[jt]sx?$`]: [
            "ts-jest",
            {
                tsconfig: "<rootDir>/test/tsconfig.json",
            },
        ],
    },

    // The root directory that Jest should scan for tests and modules within
    rootDir: "..",

    // A list of paths to directories that Jest should use to search for files in
    roots: ["<rootDir>/src", "<rootDir>/test"],

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],

    // All imported modules in your tests should be mocked automatically
    automock: false,

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    watchPathIgnorePatterns: ["<rootDir>/build/"],
};

export default config;
