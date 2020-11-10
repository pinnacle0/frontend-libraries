interface Options {
    packageJsonFilepath: string;
}

/**
 * Checks if a prettier config can be resolved.
 * Supports all prettier configuration formats (prettier.config.js, .prettierrc, .prettierrc.js).
 *
 * The configuration file will be used when running \`prettier.check\` to check if source files are formatted.
 */
export function checkPrettierConfig({packageJsonFilepath}: Options) {
    let prettier: typeof import("prettier");
    try {
        prettier = require("prettier");
    } catch {
        throw new Error(`Cannot load prettier module (resolve from "webpack-util"), make sure prettier is installed.`);
    }

    if (prettier.resolveConfigFile(packageJsonFilepath) === null) {
        throw new Error(`Cannot load prettier config, make sure a prettier config file is present at your workspace.`);
    }
}
