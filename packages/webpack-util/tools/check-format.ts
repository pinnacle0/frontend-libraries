import path from "path";
import {runCommand} from "../src/util";

const workspaceRootDirectory = path.join(__dirname, "../../..");
const projectDirectory = path.join(__dirname, "..");

export default function checkFormat() {
    runCommand(workspaceRootDirectory)(
        String.raw`yarn \
        prettier \
        --config prettier.config.js \
        --ignore-path .prettierignore \
        --list-different \
        "${projectDirectory}/**/*.ts"`
    );
}
