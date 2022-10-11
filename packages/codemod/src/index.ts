import fs from "fs-extra";
import glob from "glob";
import chalk from "chalk";
import type {ModType} from "./modType";
import {createApi, resolveCodemod} from "./util";

export interface Options {
    dry: true;
}

export interface Stats {
    all: string[];
    transformed: string[];
}

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

export async function run(type: ModType, paths: string[] | string, options: Options): Promise<Stats | null> {
    let matchedPaths: string[] = [];
    const transform = resolveCodemod(type);

    if (Array.isArray(paths)) {
        matchedPaths = paths;
    } else {
        matchedPaths = await globPromise(paths);
    }

    if (!transform || matchedPaths.length < 1) return null;

    const transformed: string[] = [];
    for (const path of matchedPaths) {
        console.info("transforming: " + path);
        const content = await fs.readFile(path, {encoding: "utf8"});
        const result = transform(content, createApi());
        if (result) {
            transformed.push(path);
            options.dry ? console.info(result) : await fs.writeFile(path, result, {encoding: "utf8"});
        }
    }

    console.info(`transformed: ${chalk.green(transformed.length)}, Unmodified: ${chalk.yellow(matchedPaths.length - transformed.length)}`);

    return {all: matchedPaths, transformed};
}
