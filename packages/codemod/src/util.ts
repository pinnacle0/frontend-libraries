import path from "path";
import fs from "fs-extra";
import glob from "glob";
import type {Codemod, Transform} from "./type";

export async function resolveCodemodPath(modType: string): Promise<string | null> {
    const postfixList = [".js", ".ts", "jsx", ".tsx", "/index.js", "/index.ts", "/index.jsx", "/index.tsx"];

    for (const postfix of postfixList) {
        try {
            const realPath = path.resolve(__dirname, "./mod", modType + postfix);
            await fs.access(realPath);
            return realPath;
        } catch {
            // do nothing
        }
    }
    return null;
}

export async function resolveCodemod(type: Codemod): Promise<Transform | null> {
    const modPath = await resolveCodemodPath(type);
    if (modPath) {
        return require(modPath).default as Promise<Transform>;
    } else {
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
