import fs from "fs";

interface Options {
    filepath: string;
}

/**
 * Checks if `src/index.html` exists.
 * May add more checks later.
 *
 * This file will be used as the html template for \`HtmlWebpackPlugin\`.
 */
export function checkSrcIndexHtml({filepath}: Options) {
    if (!(fs.existsSync(filepath) && fs.statSync(filepath).isFile())) {
        throw new Error(
            `Cannot find src/index.html in project directory as "${filepath}".
            \`src/index.html\` is required by \`HtmlWebpackPlugin\` as html output template file.`
                .split("\n")
                .map(line => line.trim())
                .join("\n")
        );
    }
}
