import * as path from "path";
import {paths} from "./paths";
import {runCommand} from "./run-command";

const {workspaceRootDirectory, configDirectory, srcDirectory, testDirectory, toolsDirectory} = paths;

export default function format() {
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --write \
        "${configDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --write \
        "${srcDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --write \
        "${testDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
    runCommand(
        String.raw`yarn run prettier \
        --config ${path.join(workspaceRootDirectory, "prettier.config.js")} \
        --ignore-path ${path.join(workspaceRootDirectory, ".prettierignore")} \
        --write \
        "${toolsDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
}
