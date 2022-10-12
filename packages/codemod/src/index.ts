import fs from "fs-extra";
import chalk from "chalk";
import type {ModType} from "./modType";
import {createApi, globPromise, resolveCodemod} from "./util";
import path from "path";

export interface Options {
    dry: boolean;
}

export interface Stats {
    all: string[];
    transformed: string[];
}

export async function run(type: ModType, paths: string[] | string, options: Options) {
    let matchedPaths: string[] = [];
    const transform = await resolveCodemod(type);

    if (Array.isArray(paths)) {
        matchedPaths = paths.map(_ => (path.isAbsolute(_) ? _ : path.resolve(process.cwd(), _)));
    } else {
        matchedPaths = await globPromise(paths, {cwd: process.cwd()});
    }

    for (const matchedPath of matchedPaths) {
        try {
            await fs.access(matchedPath);
        } catch {
            throw new Error("File does not exist: " + matchedPath);
        }
    }

    if (!transform) {
        console.info(chalk.red(`Unable to find codemod: ${chalk.bold(type)}`));
        return;
    }

    if (matchedPaths.length < 1) {
        console.info(chalk.red("No file found"));
        return;
    }

    const transformed: string[] = [];
    for (const path of matchedPaths) {
        const content = await fs.readFile(path, {encoding: "utf8"});
        const result = transform(content, createApi());
        if (result) {
            console.info(`${chalk.bgGreen(" TRANSFORM ")}  ${path}`);
            transformed.push(path);
            options.dry ? console.info(result) : await fs.writeFile(path, result, {encoding: "utf8"});
        } else {
            console.info(`${chalk.bgYellow(" UNMODIFIED ")}  ${path}`);
        }
    }

    console.info(`transformed: ${chalk.green(transformed.length)}, Unmodified: ${chalk.yellow(matchedPaths.length - transformed.length)}`);
}
