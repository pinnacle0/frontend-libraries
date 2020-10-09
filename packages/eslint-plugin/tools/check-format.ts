import * as path from "path";
import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {workspaceRootDirectory, configDirectory, srcDirectory, testDirectory, toolsDirectory} = pathMap;

export default function checkFormat() {
    runCommand(
        String.raw`yarn run \
        --cwd="${workspaceRootDirectory}" \
        prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${configDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run \
        --cwd="${workspaceRootDirectory}" \
        prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${srcDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run \
        --cwd="${workspaceRootDirectory}" \
        prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${testDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run \
        --cwd="${workspaceRootDirectory}" \
        prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --list-different \
        "${toolsDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
}
