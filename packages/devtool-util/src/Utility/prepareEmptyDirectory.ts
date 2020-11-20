import * as fs from "fs";

export function prepareEmptyDirectory(directory: string) {
    const folderExist = fs.existsSync(directory);
    if (folderExist) {
        if (fs.statSync(directory).isDirectory()) {
            fs.rmdirSync(directory, {recursive: true});
        } else {
            throw new Error(`Path ${directory} is not a directory`);
        }
    }
    fs.mkdirSync(directory, {recursive: true});
}
