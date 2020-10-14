import path from "path";
import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {workspaceRootDirectory, projectDirectory} = pathMap;

export default function lint() {
    runCommand(
        String.raw`yarn run \
        -cwd="${workspaceRootDirectory}" \
        eslint \
        --config ${workspaceRootDirectory}/.eslintrc.js \
        --ignore-path ${workspaceRootDirectory}/.eslintignore \
        --ext .js,.jsx,.ts,.tsx \
        "${projectDirectory}/{e2e,src,test,tools}"`
    );
}
