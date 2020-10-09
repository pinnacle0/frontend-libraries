// @ts-check

/** @type {import("@jest/types/build/Config").InitialOptionsWithRootDir} */
const config = {
    // Stop running tests after `n` failures
    bail: 1,

    // A preset that is used as a base for Jest's configuration
    preset: "ts-jest",

    // The root directory that Jest should scan for tests and modules within
    rootDir: "../test",

    // A map from regular expressions to paths to transformers
    transform: {
        [String.raw`\.(ts|tsx)$`]: "ts-jest",
    },
};

module.exports = config;
