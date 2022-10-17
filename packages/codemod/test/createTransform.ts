import {createToolkit} from "../src/toolkit";
import type {Codemod} from "../src/type";

export function createTransform(type: Codemod) {
    const transform = require("../src/mod/" + type).transform;
    if (!transform) {
        throw new Error("Unable to find codemod: " + type);
    }
    return (source: string) => {
        const result = transform(source, createToolkit());
        return result ?? source;
    };
}
