import path from "path";
import fs from "fs/promises";
import type {Codemod, Transform} from "./type";

export async function resolveCodemodPath(modType: string): Promise<string | null> {
    const postfixList = [".js", ".ts", "jsx", ".tsx", "/index.js", "/index.ts", "/index.jsx", "/index.tsx"];

    for (const postfix of postfixList) {
        try {
            const realPath = path.resolve(import.meta.dirname, "./mod", modType + postfix);
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
        return require(modPath).transform as Transform;
    } else {
        return null;
    }
}
