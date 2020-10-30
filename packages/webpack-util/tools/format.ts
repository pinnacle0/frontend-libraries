import path from "path";
import {runCommand} from "../src/util";

// TODO: import PrettierUtil, then .format()

const workspaceRootDirectory = path.join(__dirname, "../../..");
const projectDirectory = path.join(__dirname, "..");

export default function format() {
    runCommand(workspaceRootDirectory)(
        String.raw`yarn \
        prettier \
        --config prettier.config.js \
        --ignore-path .prettierignore \
        --write \
        "${projectDirectory}/**/*.ts"`
    );
}
