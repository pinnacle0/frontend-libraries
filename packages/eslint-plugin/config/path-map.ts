import * as path from "path";

export const pathMap = {
    workspaceRootDirectory: path.join(__dirname, "../../.."),
    projectDirectory: path.join(__dirname, ".."),
    srcDirectory: path.join(__dirname, "../src"),
    distDirectory: path.join(__dirname, "../dist"),
    testDirectory: path.join(__dirname, "../test"),
    toolsDirectory: path.join(__dirname, "../tools"),
    configDirectory: path.join(__dirname, "../config"),
};

Object.freeze(pathMap);
