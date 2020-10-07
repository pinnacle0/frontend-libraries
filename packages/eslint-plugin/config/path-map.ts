import path from "path";

const rootDirectory = path.join(__dirname, "..");

export const pathMap = {
    rootDirectory,

    // Config files & directory
    packageJson: path.join(rootDirectory, "package.json"),
    eslintConfig: path.join(rootDirectory, "config", ".eslintrc.js"),
    jestConfig: path.join(rootDirectory, "config", "jest.config.js"),
    prettierConfig: path.join(rootDirectory, "config", "prettier.config.js"),
    tsconfig: path.join(rootDirectory, "config", "tsconfig.json"),
    readMe: path.join(rootDirectory, "README.md"),
    configDirectory: path.join(rootDirectory, "config"),

    // Build directories
    distDirectory: path.join(rootDirectory, "dist"),

    // Source directories
    srcDirectory: path.join(rootDirectory, "src"),
    srcConfigDirectory: path.join(rootDirectory, "src", "config"),
    srcRuleDirectory: path.join(rootDirectory, "src", "rules"),
    srcUtilDirectory: path.join(rootDirectory, "src", "util"),

    // Test directories
    testDirectory: path.join(rootDirectory, "tests"),
    testRuleDirectory: path.join(rootDirectory, "tests", "rules"),

    // Tool directories
    toolDirectory: path.join(rootDirectory, "tools"),
    toolUtilDirectory: path.join(rootDirectory, "tools", "util"),
    commandDirectory: path.join(rootDirectory, "tools", "commands"),
    templateDirectory: path.join(rootDirectory, "tools", "templates"),
};

export type PathMap = typeof pathMap;
