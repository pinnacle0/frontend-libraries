import * as path from "path";

export const paths = {
    workspaceRootDirectory: path.join(__dirname, "../../.."),
    projectDirectory: path.join(__dirname, ".."),
    srcDirectory: path.join(__dirname, "../src"),
    distDirectory: path.join(__dirname, "../dist"),
    testDirectory: path.join(__dirname, "../tests"), // TODO/Lok: Rename folder
    toolsDirectory: path.join(__dirname, "."),
    configDirectory: path.join(__dirname, "../config"),
};

Object.freeze(paths);
