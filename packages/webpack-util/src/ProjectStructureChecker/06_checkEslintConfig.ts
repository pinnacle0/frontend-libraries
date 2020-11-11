import fs from "fs";
import path from "path";

/**
 * Checks if an eslint config can be resolved.
 * Only supports ".eslintrc.js" configuration format.
 *
 * (Technically `eslint` can still resolve the ".eslintrc", ".eslintrc.yml", etc,
 * but please use the ".eslintrc.js" for the sake of consistency.)
 *
 * The configuration file will be used when running `ForkTsCheckerWebpackPlugin` with the `eslint` option,
 * and resolved automatically by the internal mechanics of `eslint`.
 */
export function checkEslintConfig() {
    try {
        require("eslint");
    } catch {
        throw new Error(`Cannot load eslint module (resolve from "webpack-util"), make sure eslint is installed.`);
    }

    let searchDirectory = __dirname;
    let found = false;
    while (searchDirectory !== path.dirname(searchDirectory)) {
        const eslintrcJsFilepath = path.join(searchDirectory, ".eslintrc.js");
        if (fs.existsSync(eslintrcJsFilepath)) {
            found = true;
            break;
        }
        searchDirectory = path.dirname(searchDirectory);
    }
    if (!found) {
        throw new Error(
            `Cannot find \`.eslintrc.js\` up to root directory recursively,
            make sure a \`.eslintrc.js\` is present at your workspace.
            (Other eslint config file formats are not supported).`
                .split("\n")
                .map(line => line.trim())
                .join("\n")
        );
    }
}
