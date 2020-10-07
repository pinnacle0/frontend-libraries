import fs from "fs-extra";
import path from "path";
import {pathMap} from "../../config/path-map";
import * as PrintUtil from "./print-util";
import * as RunUtil from "./run-util";

const print = PrintUtil.createPrint("FileUtil");

/**
 * Check target files formatting via Prettier.
 * Accept both file path or folder as input
 *
 * Example:
 * ```
 * checkFile('./src')
 * checkFile('./src/index.ts', './api')
 * ```
 */
export function checkFile(...files: string[]) {
    const prettierConfigPath = pathMap.prettierConfig;
    files
        .filter(file => path.extname(file) || (!path.extname(file) && fs.readdirSync(file).length))
        .map(file => (path.extname(file) ? file : path.join(file, "*")))
        .forEach(file => {
            print.info(["Checking code format", file]);
            RunUtil.runProcess("prettier", ["--list-different", "--config", prettierConfigPath, file]);
        });
}

/**
 * Formatting target files via Prettier.
 * Accept both file path or folder as input
 *
 * Example:
 * ```
 * formatFile('./src')
 * formatFile('./src/index.ts', './api')
 * ```
 */
export function formatFile(...files: string[]) {
    const prettierConfigPath = pathMap.prettierConfig;
    files
        .filter(file => path.extname(file) || (!path.extname(file) && fs.readdirSync(file).length))
        .map(file => (path.extname(file) ? file : path.join(file, "/*")))
        .forEach(file => {
            print.info(["Formatting file", file]);
            RunUtil.runProcess("prettier", ["--write", "--config", prettierConfigPath, file]);
        });
}

/**
 * Linting target files via Prettier.
 * Accept both file path or folder as input
 *
 * Example:
 * ```
 * lintFile('./src')
 * lintFile('./src/index.ts', './api')
 * ```
 */
export function lintFile(...files: string[]) {
    const eslintConfigPath = pathMap.eslintConfig;
    files
        .filter(file => path.extname(file) || (!path.extname(file) && fs.readdirSync(file).length))
        .map(file => (path.extname(file) ? file : path.join(file, "/*")))
        .forEach(file => {
            print.info(["Formatting file", file]);
            RunUtil.runProcess("eslint", ["--ext", ".js,.jsx,.ts,.tsx", "--config", eslintConfigPath, file]);
        });
}

/**
 * Preparing an empty folder directory.
 *
 * create an empty folder for the given directory if it did not yet exist,
 * or clean the target directory if it has already existed.
 *
 * @param directory
 */
export async function prepareFolder(directory: string) {
    print.info(["Preparing folder", directory]);

    const folderExist = await fs.pathExists(directory);
    if (!folderExist) await fs.mkdir(directory);
    await fs.emptyDir(directory);
}

/**
 * Replace the file content placeholders, replace all {1} with replacedContents[0], all {2} with replacedContents[1], and so on.
 */
export function replaceTemplate(filePath: string, replacedContents: string[]) {
    try {
        let fileContent: string = fs.readFileSync(filePath, {encoding: "utf8"});
        replacedContents.forEach((content, i) => (fileContent = fileContent.replace(new RegExp("\\{" + (i + 1) + "\\}", "g"), content)));
        fs.writeFileSync(filePath, fileContent);
    } catch (error) {
        print.error(error);
        process.exit(1);
    }
}

/**
 * Return all file full paths matching the predicate.
 */
export function getFilesRecursively(baseFolder: string, predicate: (file: string) => boolean): string[] {
    const matchedFiles: string[] = [];
    fs.readdirSync(baseFolder).forEach(file => {
        const fullPath = path.join(baseFolder, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            matchedFiles.push(...getFilesRecursively(fullPath, predicate));
        } else if (predicate(file)) {
            matchedFiles.push(fullPath);
        }
    });
    return matchedFiles;
}
