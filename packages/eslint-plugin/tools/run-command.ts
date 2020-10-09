import * as childProcess from "child_process";
import {paths} from "./paths";

export function runCommand(command: string) {
    return childProcess.execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
        cwd: paths.workspaceRootDirectory,
    });
}
