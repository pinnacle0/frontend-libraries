/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires -- node env */

const path = require("path");

module.exports.pathMap = {
    workspaceRootDirectory: path.join(__dirname, "../../.."),
    projectDirectory: path.join(__dirname, ".."),
    srcDirectory: path.join(__dirname, "../src"),
    distDirectory: path.join(__dirname, "../dist"),
    testDirectory: path.join(__dirname, "../test"),
    toolsDirectory: path.join(__dirname, "../tools"),
    configDirectory: path.join(__dirname, "../config"),

    srcTsconfigFile: path.join(__dirname, "../config/tsconfig.src.json"),
    testEntryScriptFile: path.join(__dirname, "../test/ui-test/index.tsx"),
    testIndexHtmlFile: path.join(__dirname, "../test/ui-test/index.html"),
    stylelintConfigFile: path.join(__dirname, "../../../stylelint.config.js"),
};

Object.freeze(module.exports.pathMap);
