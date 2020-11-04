import * as fs from "fs";
import * as path from "path";
import {Utility} from "../Utility";

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
    if (!fs.existsSync(fileOrDirectory)) {
        throw new Error(`Cannot format "${fileOrDirectory}" because it does not exists.`);
    }
    if (fs.statSync(fileOrDirectory).isDirectory()) {
        const quotedGlobPattern = path.join(fileOrDirectory, `"**/*.{cjs,css,html,js,json,jsx,less,mjs,ts,tsx}"`);
        Utility.runCommand("prettier", ["--write", quotedGlobPattern]);
        return;
    }
    if (fs.statSync(fileOrDirectory).isFile()) {
        const file = fileOrDirectory;
        Utility.runCommand("prettier", ["--write", file]);
        return;
    }
    throw new Error(`Cannot format "${fileOrDirectory}" because it is not a file or directory.`);
}
