import * as path from "path";
import {paths} from "./paths";
import {runCommand} from "./run-command";

const {workspaceRootDirectory, srcDirectory, testDirectory, toolsDirectory} = paths;

export default function lint() {
    runCommand(
        String.raw`yarn run eslint \
        --config ${(path.join(workspaceRootDirectory), ".eslintrc.js")} \
        --ignore-path ${(path.join(workspaceRootDirectory), ".eslintignore")} \
        --ext .js,.jsx,.ts,.tsx \
        "${srcDirectory}"`
    );
    runCommand(
        String.raw`yarn run eslint \
        --config ${(path.join(workspaceRootDirectory), ".eslintrc.js")} \
        --ignore-path ${(path.join(workspaceRootDirectory), ".eslintignore")} \
        --ext .js,.jsx,.ts,.tsx \
        "${testDirectory}"`
    );
    runCommand(
        String.raw`yarn run eslint \
        --config ${(path.join(workspaceRootDirectory), ".eslintrc.js")} \
        --ignore-path ${(path.join(workspaceRootDirectory), ".eslintignore")} \
        --ext .js,.jsx,.ts,.tsx \
        "${toolsDirectory}"`
    );
}
