import chalk from "chalk";
import fs from "fs-extra";
import {glob} from "glob";
import path from "path";
import {resolveCodemod} from "./util";
import {createToolkit} from "./toolkit";
import type {Codemod, CreateToolkitOptions} from "./type";

export interface Options extends CreateToolkitOptions {
    dry?: boolean;
    afterEvery?: (filename: string) => Promise<void> | void;
    afterAll?: (filename: string[]) => Promise<void> | void;
}

export async function runner(type: Codemod, paths: string[] | string, options: Options) {
    let matchedPaths: string[] = [];
    const transform = await resolveCodemod(type);

    const mergedOptions = {
        dry: false,
        ...options,
    };

    if (Array.isArray(paths)) {
        matchedPaths = paths.map(_ => (path.isAbsolute(_) ? _ : path.resolve(process.cwd(), _)));
    } else {
        matchedPaths = await glob(paths, {});
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
        let result: string | void;
        try {
            result = transform(content, createToolkit({generate: options.generate, parse: options.parse}));
        } catch (error) {
            console.info(`${chalk.bgRed(" Failed ")} ${path}`);
            console.error(error);
            break;
        }
        if (result) {
            console.info(`${chalk.bgGreen(" TRANSFORM ")}  ${path}`);
            transformed.push(path);
            if (mergedOptions.dry) {
                console.info(result);
            } else {
                await fs.writeFile(path, result, {encoding: "utf8"});
                mergedOptions?.afterEvery?.(path);
            }
        } else {
            console.info(`${chalk.bgYellow(" UNMODIFIED ")}  ${path}`);
        }
    }

    !mergedOptions.dry && mergedOptions?.afterAll?.(transformed);

    console.info(`transformed: ${chalk.green(transformed.length)}, Unmodified: ${chalk.yellow(matchedPaths.length - transformed.length)}`);
}
