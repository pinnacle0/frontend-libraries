import fs from "fs";
import path from "path";
import {Utility} from "./Utility/index.js";

// https://prettier.io/docs/en/cli.html#exit-codes
const PRETTIER_EXIT_CODE_WHEN_NO_FILES_ARE_FOUND = 2;

// https://github.com/prettier/prettier/pull/6203#issuecomment-702319765
function closestPrettierIgnoreFile(searchPath: string): string | null {
    const prettierIgnorePath = path.join(searchPath, ".prettierignore");
    if (fs.existsSync(prettierIgnorePath) && fs.statSync(prettierIgnorePath).isFile()) {
        return prettierIgnorePath;
    }

    const parentDirectory = path.dirname(searchPath);
    if (parentDirectory === searchPath) {
        return null;
    }

    return closestPrettierIgnoreFile(parentDirectory);
}

function runPrettierCommand(fileOrDirectory: string, flag: "--check" | "--write") {
    if (fileOrDirectory.includes("*") || fileOrDirectory.includes("{")) {
        throw new Error(`Glob pattern not supported: ${fileOrDirectory}`);
    }
    if (!fs.existsSync(fileOrDirectory)) {
        throw new Error(`Path not exist: ${fileOrDirectory}`);
    }

    const prettierIgnorePath = closestPrettierIgnoreFile(fileOrDirectory);
    const prettierIgnoreFlags = prettierIgnorePath ? ["--ignore-path", prettierIgnorePath] : [];

    const fileStats = fs.statSync(fileOrDirectory);
    if (fileStats.isDirectory()) {
        try {
            // experimental-cli ref: https://prettier.io/blog/2025/06/23/3.6.0#cli
            Utility.runCommand("prettier", [flag, fileOrDirectory, ...prettierIgnoreFlags, "--no-error-on-unmatched-pattern", "--experimental-cli"]);
        } catch (error) {
            if (error && (error as any).childProcessResult?.status === PRETTIER_EXIT_CODE_WHEN_NO_FILES_ARE_FOUND) {
                return;
            }
            throw error;
        }
    } else if (fileStats.isFile()) {
        Utility.runCommand("prettier", [flag, fileOrDirectory, ...prettierIgnoreFlags, "--experimental-cli"]);
    } else {
        throw new Error(`Path is not a file/directory: ${fileOrDirectory}`);
    }
}

function check(fileOrDirectory: string) {
    runPrettierCommand(fileOrDirectory, "--check");
}

function format(fileOrDirectory: string) {
    runPrettierCommand(fileOrDirectory, "--write");
}

export const PrettierUtil = Object.freeze({
    check,
    format,
});
