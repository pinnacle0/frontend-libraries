import fs from "fs";
import path from "path";
/**
 * Checks if an stylelint config can be resolved.
 * Only supports "stylelint.config.js" configuration format.
 *
 * (Technically `stylelint` can still resolve the ".stylelintrc", ".stylelintrc.js", etc,
 * but please use the "stylelint.config.js" for the sake of consistency.)
 *
 * The configuration file will be used when running `StylelintWebpackPlugin`,
 * and resolved automatically by the internal mechanics of `stylelint`.
 */
export function checkStylelintConfig() {
    try {
        require("stylelint");
    } catch {
        throw new Error(`Cannot load stylelint module (resolve from "webpack-util"), make sure stylelint is installed.`);
    }

    let searchDirectory = __dirname;
    let found = false;
    while (searchDirectory !== path.dirname(searchDirectory)) {
        const stylelintConfigJsFilepath = path.join(searchDirectory, "stylelint.config.js");
        if (fs.existsSync(stylelintConfigJsFilepath)) {
            found = true;
            break;
        }
        searchDirectory = path.dirname(searchDirectory);
    }
    if (!found) {
        throw new Error(
            `Cannot find \`stylelint.config.js\` up to root directory recursively,
            make sure a \`stylelint.config.js\` is present at your workspace.
            (Other stylelint config file formats are not supported).`
                .split("\n")
                .map(line => line.trim())
                .join("\n")
        );
    }
}
