import type {JSCodeShiftOptions} from "./runner";
import {runner} from "./runner";
import path from "path";
import glob from "glob";
import type {ModType} from "./modType";

function globPromise(path: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        glob(path, (error, matches) => {
            if (error) {
                reject(error);
            } else {
                resolve(matches);
            }
        });
    });
}

export async function run(type: ModType, paths: string[] | string, options: JSCodeShiftOptions) {
    let matches: string[];
    if (Array.isArray(paths)) {
        matches = paths;
    } else {
        try {
            matches = await globPromise(paths);
        } catch (e) {
            console.error(e);
            return;
        }
    }
    return runner(path.join(__dirname, "mod", type + ".js"), matches, options);
}
