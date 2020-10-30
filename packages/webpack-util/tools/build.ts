import path from "path";
import {runCommand} from "../src/util";
import checkFormat from "./check-format";

const workspaceRootDirectory = path.join(__dirname, "../../..");
const projectDirectory = path.join(__dirname, "..");

export default function build() {
    // TODO: use PrettierUtil.check
    checkFormat();
    runCommand(projectDirectory)(
        String.raw`yarn \
        tsc --project tsconfig.json`
    );
}
