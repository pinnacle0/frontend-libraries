import * as path from "path";

export const pathMap = {
    workspaceRootDirectory: path.join(__dirname, "../../.."),
    projectDirectory: path.join(__dirname, ".."),
    distDirectory: path.join(__dirname, "../dist"),
    configDirectory: path.join(__dirname, "../config"),
};

Object.freeze(pathMap);
