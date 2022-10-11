import path from "path";
import * as t from "@babel/types";
import glob from "glob";
import {parse} from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import type {API, Transform} from "./type";
import type {ModType} from "./modType";

export function createApi(): API {
    return {
        parse: (source: string) =>
            parse(source, {
                sourceType: "module",
                attachComment: true,
                plugins: ["jsx", "typescript", "decorators-legacy"],
            }),
        builder: t,
        traverse,
        generate,
    };
}

export function resolveCodemod(type: ModType): Transform | null {
    try {
        const modPath = require.resolve(path.join(__dirname, "./mod/" + type));
        return require(modPath).default;
    } catch (e) {
        return null;
    }
}

export function globPromise(path: string, options: glob.IOptions): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        glob(path, options, (error, matches) => {
            if (error) {
                reject(error);
            } else {
                resolve(matches);
            }
        });
    });
}
