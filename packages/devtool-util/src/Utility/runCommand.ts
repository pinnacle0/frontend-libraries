import childProcess from "child_process";
import fs from "fs";
import path from "path";

/**
 * Spawns a new shell and execute a command with arguments.
 *
 * Searches for .../node_modules/.bin/<command> upwards recursively
 * and falls back to running as a system command.
 * It is advised against to rely on relative paths (cwd is not set).
 * Use `import("path").join(import.meta.dirname, "./your-path-here")` or the
 * the ESM equivalent to wrap the relative path.
 *
 * Example usage:
 * - `runCommand("tsc", "--project", projectDirectory + "/tsconfig.json"); // Runs typescript compiler`
 * - `runCommand("rm", "-rf", projectDirectory + "/build"); // Remove build directory, does not work on windows cmd.exe`
 *
 * @param command Name of binary to be executed.
 * @param args Arguments passed to the command, whitespace are escaped.
 */
export function runCommand(command: string, args: string[] = []) {
    const execute = (command: string) => {
        const result = childProcess.spawnSync(command, args, {
            encoding: "utf8",
            shell: true,
            stdio: "inherit",
        });
        if (result.error) {
            console.error(`Process executing command "${command}" failed or timeout.\n`);
            (result.error as any).childProcessResult = result;
            throw result.error;
        }
        if (result.signal !== null) {
            const error = new Error(`Command "${command}" terminated with ${result.signal}`);
            (error as any).childProcessResult = result;
            throw error;
        }
        if (result.status !== 0) {
            const error = new Error(`Command "${command}" returns non-zero exit code`);
            (error as any).childProcessResult = result;
            throw error;
        }
        return result;
    };

    let searchDirectory = import.meta.dirname;
    while (searchDirectory !== path.dirname(searchDirectory)) {
        const fullCommandPath = path.join(searchDirectory, "node_modules/.bin", command);
        if (fs.existsSync(fullCommandPath)) {
            // Found command in node_modules/.bin, execute and short-circuit return
            return execute(fullCommandPath);
        }
        searchDirectory = path.dirname(searchDirectory);
    }

    // Fall back to execute as system command
    return execute(command);
}
