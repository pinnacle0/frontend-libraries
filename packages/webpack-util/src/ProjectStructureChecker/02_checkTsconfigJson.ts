import fs from "fs";
import glob from "glob";

interface Options {
    srcDirectory: string;
    filepath: string;
}

/**
 * Checks if tsconfig.json exists.
 * May add more checks later.
 */
export function checkTsconfigJson({srcDirectory, filepath}: Options) {
    const tsFileCount = glob.sync("**/*.{ts,tsx}", {cwd: srcDirectory}).length;
    if (tsFileCount === 0) {
        // There are no typescript files in this project (e.g. using index.css as main entry)
        // Allow the project to have no tsconfig.json
        return;
    }
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
