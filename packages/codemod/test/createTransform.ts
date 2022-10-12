import path from "path";
import type {ModType} from "../src/modType";
import {createApi} from "../src/util";

/**
 * Test fixtures is located in test/__testfixtures__/<codemod-name>
 * A test should be provided with both <prefix>.input.tsx and <prefix>.output.tsx
 */

export function createTransform(type: ModType) {
    const transform = require("../src/mod/" + type).default;
    if (!transform) {
        throw new Error("Unable to find codemod: " + type);
    }
    return (source: string) => {
        const result = transform(source, createApi());
        return result ?? source;
    };
}
