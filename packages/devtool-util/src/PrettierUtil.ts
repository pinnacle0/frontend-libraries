import fs from "fs";
import path from "path";
import {Utility} from "./Utility";

// https://prettier.io/docs/en/cli.html#exit-codes
const PRETTIER_EXIT_CODE_WHEN_NO_FILES_ARE_FOUND = 2;

// https://github.com/prettier/prettier/pull/6203#issuecomment-702319765
function findFirstPrettierIgnoreFile(searchPath: string): string | null {
    const prettierIgnorePath = path.join(searchPath, ".prettierignore");
    if (fs.existsSync(prettierIgnorePath) && fs.statSync(prettierIgnorePath).isFile()) {
        return prettierIgnorePath;
    }

    const parentDirectory = path.dirname(searchPath);
    if (parentDirectory === searchPath) {
        return null;
    }

    return findFirstPrettierIgnoreFile(parentDirectory);
}

function runPrettierCommand(fileOrDirectory: string, flag: "--check" | "--write") {
    if (fileOrDirectory.includes("*") || fileOrDirectory.includes("{")) {
        throw new Error(`Glob pattern not supported: ${fileOrDirectory}`);
    }
    if (!fs.existsSync(fileOrDirectory)) {
        throw new Error(`Path not exist: ${fileOrDirectory}`);
    }

    const prettierIgnorePath = findFirstPrettierIgnoreFile(fileOrDirectory);
    const prettierIgnoreFlags = prettierIgnorePath ? ["--ignore-path", prettierIgnorePath] : [];

    const fileStats = fs.statSync(fileOrDirectory);
    if (fileStats.isDirectory()) {
        const quotedGlobPattern = path.join(fileOrDirectory, `"**/*.{css,html,js,json,jsx,less,ts,tsx}"`);
        try {
            Utility.runCommand("prettier", [flag, quotedGlobPattern, ...prettierIgnoreFlags]);
        } catch (error) {
            if (typeof error === "object" && error !== null && error?.childProcessResult?.status === PRETTIER_EXIT_CODE_WHEN_NO_FILES_ARE_FOUND) {
                return;
            }
            throw error;
        }
    } else if (fileStats.isFile()) {
        Utility.runCommand("prettier", [flag, fileOrDirectory, ...prettierIgnoreFlags]);
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
