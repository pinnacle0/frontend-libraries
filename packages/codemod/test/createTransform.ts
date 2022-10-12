import {createApi} from "../src/util";
import type {Codemod} from "../src/type";

/**
 * Test fixtures is located in test/__testfixtures__/<codemod-name>
 * A test should be provided with both <prefix>.input.tsx and <prefix>.output.tsx
 */

export function createTransform(type: Codemod) {
    const transform = require("../src/mod/" + type).default;
    if (!transform) {
        throw new Error("Unable to find codemod: " + type);
    }
    return (source: string) => {
        const result = transform(source, createApi());
        return result ?? source;
    };
}
