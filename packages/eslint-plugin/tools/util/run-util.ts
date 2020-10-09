import * as childProcess from "child_process";

export function runCommand(command: string) {
    return childProcess.execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
    });
}
