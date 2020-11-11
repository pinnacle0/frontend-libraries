import fs from "fs";

interface Options {
    filepath: string;
}

/**
 * Checks if tsconfig.json exists.
 * May add more checks later.
 */
export function checkTsconfigJson({filepath}: Options) {
    if (!(fs.existsSync(filepath) && fs.statSync(filepath).isFile())) {
        throw new Error(
            `Cannot find tsconfig.json at "${filepath}".
            \`tsconfig.json\` is required for typechecking ts code & transpilation.`
                .split("\n")
                .map(line => line.trim())
                .join("\n")
        );
    }
    // TODO: Check resolved tsconfig.json has module: "ESNext"?
    // TODO: Check resolved tsconfig.json has target: "ES5"?
}
