import * as fs from "fs";

/**
 * Replace the file content placeholders:
 * replace all {1} with replacedContents[0], all {2} with replacedContents[1], and so on.
 *
 * Note that the placeholder index starts at 1.
 */
export function replaceTemplate(filePath: string, replacedContents: string[]) {
    try {
        let fileContent = fs.readFileSync(filePath, {encoding: "utf8"});
        replacedContents.forEach((content, i) => {
            fileContent = fileContent.replace(new RegExp("\\{" + (i + 1) + "\\}", "g"), content);
        });
        fs.writeFileSync(filePath, fileContent, {encoding: "utf8"});
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
