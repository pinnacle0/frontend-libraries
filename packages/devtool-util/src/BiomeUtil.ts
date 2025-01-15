import fs from "fs";
import {Utility} from "./Utility/index.js";

function isEmptyDirectory(directory: string): boolean {
    const files = fs.readdirSync(directory);
    return files.length === 0;
}

function runBiomeCommand(fileOrDirectory: string, overwrite?: boolean) {
    if (fileOrDirectory.includes("*") || fileOrDirectory.includes("{")) {
        throw new Error(`Glob pattern not supported: ${fileOrDirectory}`);
    }
    if (!fs.existsSync(fileOrDirectory)) {
        throw new Error(`Path not exist: ${fileOrDirectory}`);
    }

    const commandArgs = overwrite ? ["format", "--write"] : ["format"];
    const fileStats = fs.statSync(fileOrDirectory);
    const isDirectory = fileStats.isDirectory();

    if (isDirectory && isEmptyDirectory(fileOrDirectory)) return;

    if (isDirectory || fileStats.isFile()) {
        try {
            Utility.runCommand("biome", [...commandArgs, fileOrDirectory]);
        } catch (error) {
            // directory does not have matched files should not throw error
            if (isDirectory) return;
            throw new Error(`Biome command failed: ${error}`);
        }
    } else {
        throw new Error(`Path is not a file/directory: ${fileOrDirectory}`);
    }
}

function check(fileOrDirectory: string) {
    runBiomeCommand(fileOrDirectory);
}

function format(fileOrDirectory: string) {
    runBiomeCommand(fileOrDirectory, true);
}

export const BiomeUtil = Object.freeze({
    check,
    format,
});
