import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {workspaceRootDirectory, projectDirectory} = pathMap;

export default function format() {
    runCommand(
        String.raw`yarn run \
        --cwd="${workspaceRootDirectory}" \
        prettier \
        --config "${workspaceRootDirectory}/prettier.config.js" \
        --ignore-path "${workspaceRootDirectory}/.prettierignore" \
        --list-different \
        "${projectDirectory}/**/*.{js,json,jsx,ts,tsx}"`
    );
}
