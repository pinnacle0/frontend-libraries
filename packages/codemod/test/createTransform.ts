import {createToolkit} from "../src/toolkit.js";
import type {Codemod, Transform} from "../src/type.js";

export async function createTransform(type: Codemod) {
    const mod = (await import("../src/mod/" + type)) satisfies {transform?: Transform};

    if (!mod.transform) {
        throw new Error("Unable to find codemod: " + type);
    }
    return (source: string) => {
        const result = mod.transform(source, createToolkit());
        return result ?? source;
    };
}
