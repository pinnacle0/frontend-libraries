import chalk from "chalk";
import childProcess from "child_process";
import fs from "fs-extra";
import path from "path";
import {pathMap} from "../../config/path-map";

/**
 * Run a command (support both global binary & node_modules binary) and wait for its execution.
 * Throw Error if any error occurs, or returning non-zero result.
 *
 * Usage:
 *      runProcess("prettier", ["--config", "/path"])
 */
export function runProcess(command: string, args: string[], errorMessage?: string) {
    console.info(chalk.white("Running: ") + chalk.yellowBright(command + " " + args.join(" ")));
    const localPath = path.join(pathMap.rootDirectory, "node_modules", ".bin", command);
    const canonicalCommand = fs.existsSync(localPath) ? localPath : command;
    const result = childProcess.spawnSync(canonicalCommand, args, {
        stdio: "inherit",
        shell: process.platform === "win32",
    });
    if (result.error) {
        console.error("Process execution error: " + result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        if (errorMessage) console.error(errorMessage);
        console.error(`Process returns non-zero exit code (${result.status})`);
        process.exit(1);
    }
}
