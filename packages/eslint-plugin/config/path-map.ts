import path from "path";

const workspaceRootDirectory = path.join(__dirname, "../../..");
const projectDirectory = path.join(__dirname, "..");

export const pathMap = {
    projectDirectory,
    workspaceRootDirectory,

    // Config files & directory
    packageJson: path.join(projectDirectory, "package.json"),
    eslintConfig: path.join(workspaceRootDirectory, ".eslintrc.js"),
    jestConfig: path.join(projectDirectory, "config", "jest.config.js"),
    prettierConfig: path.join(workspaceRootDirectory, "prettier.config.js"),
    tsconfig: path.join(projectDirectory, "tsconfig.json"),
    readMe: path.join(projectDirectory, "README.md"),
    configDirectory: path.join(projectDirectory, "config"),

    // Build directories
    distDirectory: path.join(projectDirectory, "dist"),

    // Source directories
    srcDirectory: path.join(projectDirectory, "src"),
    srcConfigDirectory: path.join(projectDirectory, "src", "config"),
    srcRuleDirectory: path.join(projectDirectory, "src", "rules"),
    srcUtilDirectory: path.join(projectDirectory, "src", "util"),

    // Test directories
    testDirectory: path.join(projectDirectory, "tests"),
    testRuleDirectory: path.join(projectDirectory, "tests", "rules"),

    // Tool directories
    toolDirectory: path.join(projectDirectory, "tools"),
    toolUtilDirectory: path.join(projectDirectory, "tools", "util"),
    commandDirectory: path.join(projectDirectory, "tools", "commands"),
    templateDirectory: path.join(projectDirectory, "tools", "templates"),
};

export type PathMap = typeof pathMap;
