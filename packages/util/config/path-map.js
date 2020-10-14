/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires -- node env */

const path = require("path");

module.exports.pathMap = {
    workspaceRootDirectory: path.join(__dirname, "../../.."),
    projectDirectory: path.join(__dirname, ".."),
    distDirectory: path.join(__dirname, "../dist"),
    configDirectory: path.join(__dirname, "../config"),
};

Object.freeze(module.exports.pathMap);
