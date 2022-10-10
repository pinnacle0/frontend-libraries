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
                tsconfig: "<rootDir>/config/tsconfig.test.json",
            },
        ],
    },

    // The root directory that Jest should scan for tests and modules within
    rootDir: "..",

    // A list of paths to directories that Jest should use to search for files in
    roots: ["<rootDir>/src", "<rootDir>/test"],

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    // Note: pathsToModuleNameMapper does NOT automatically pick up folder mapping from baseUrl, add "@pinnacle0/web-ui-test/*" to tsconfig.json
    moduleNameMapper: {
        [String.raw`^@pinnacle0/web-ui/(.*)$`]: "<rootDir>/src/$1",
        [String.raw`\.(css|less)$`]: "<rootDir>/config/jest-stubs/style-stub.js",
    },

    // The test environment that will be used for testing
    testEnvironment: "jsdom",

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
