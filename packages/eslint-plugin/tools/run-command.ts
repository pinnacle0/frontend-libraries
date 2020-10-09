import * as childProcess from "child_process";
import {pathMap} from "../config/path-map";

export function runCommand(command: string) {
    return childProcess.execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
        cwd: pathMap.workspaceRootDirectory,
    });
}
