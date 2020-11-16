import {Utility} from "@pinnacle0/devtool-util/src";
import path from "path";

const directory = {
    workspaceRoot: path.join(__dirname, "../../.."),
    project: path.join(__dirname, ".."),
};

Utility.runCommand("eslint", [
    "--ext",
    ".js,.jsx,.ts,.tsx",
    "--config",
    path.join(directory.project, ".eslintrc.js"),
    "--ignore-path",
    path.join(directory.workspaceRoot, ".eslintignore"),
    directory.project,
]);
