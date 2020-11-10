import fs from "fs";
import path from "path";
import {Constant} from "../Constant";

interface Options {
    srcDirectory: string;
}

/**
 * Checks if the `src/` directory contains a file that can be used as the main entry.
 *
 * This file will be used as the main entry as \`webpack.config#entry.main\`.
 */
export function checkSrcMainEntry({srcDirectory}: Options) {
    if (!(fs.existsSync(srcDirectory) && fs.statSync(srcDirectory).isDirectory())) {
        throw new Error(
            `Cannot find src/ in project directory as "${srcDirectory}".
            There should be a directory named "src" for containing the main entry file.`
        );
    }
    let found = false;
    Constant.mainChunkEntryNames.forEach(entryName => {
        const filepath = path.join(srcDirectory, entryName);
        if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
            found = true;
        }
    });
    if (!found) {
        throw new Error(
            `Cannot find any file that satisfies to be main entry in src/ as "${srcDirectory}".
            There should be a file in src/ with one of the following names: ${Constant.mainChunkEntryNames.map(_ => `"${_}"`).join(" / ")}`
                .split("\n")
                .map(line => line.trim())
                .join("\n")
        );
    }
}
