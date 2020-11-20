import * as fs from "fs";
import * as path from "path";
import {Utility} from "../Utility";

const PRETTIER_EXIT_CODE_WHEN_NO_FILES_ARE_FOUND = 2; // https://prettier.io/docs/en/cli.html#exit-codes

/**
 * Runs `prettier --write` over the provided path.
 *
 * If the path is a file, formats the file only.
 * If the path is a directory, formats all files with extension cjs, css, html, js, json, jsx, less, mjs, ts, tsx.
 *
 * Prettier config is resolved by relying on prettier's internal config resolution.
 *
 * @param fileOrDirectory Path to a file or a directory.
 */
export function format(fileOrDirectory: string): void {
    if (fileOrDirectory.includes("*") || fileOrDirectory.includes("{")) {
        throw new Error(`It seems like you are using a glob pattern to run PrettierUtil.format("${fileOrDirectory}"), but glob patterns are not supported.`);
    }
    if (!fs.existsSync(fileOrDirectory)) {
        throw new Error(`Cannot format "${fileOrDirectory}" because it is not a valid file or directory`);
    }

    if (fs.statSync(fileOrDirectory).isDirectory()) {
        const quotedGlobPattern = path.join(fileOrDirectory, `"**/*.{cjs,css,html,js,json,jsx,less,mjs,ts,tsx}"`);
        try {
            Utility.runCommand("prettier", ["--write", quotedGlobPattern]);
            return;
        } catch (error) {
            if (typeof error === "object" && error !== null && error?.childProcessResult?.status === PRETTIER_EXIT_CODE_WHEN_NO_FILES_ARE_FOUND) {
                return;
            }
            throw error;
        }
    }

    if (fs.statSync(fileOrDirectory).isFile()) {
        const file = fileOrDirectory;
        Utility.runCommand("prettier", ["--write", file]);
        return;
    }

    throw new Error(`Cannot format "${fileOrDirectory}" because it is not a file or directory.`);
}
