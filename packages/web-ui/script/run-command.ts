import cp from "child_process";
import path from "path";

export function runCommand(command: string): string {
    return cp.execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
        cwd: path.join(__dirname, "../../../"),
    });
}
