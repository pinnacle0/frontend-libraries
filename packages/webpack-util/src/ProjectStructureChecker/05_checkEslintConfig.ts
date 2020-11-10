import fs from "fs";
import path from "path";

/**
 *
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
        const eslintrcjsFilepath = path.join(searchDirectory, ".eslintrc.js");
        if (fs.existsSync(eslintrcjsFilepath)) {
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
