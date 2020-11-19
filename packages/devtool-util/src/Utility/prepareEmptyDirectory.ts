import * as fs from "fs";

export function prepareEmptyDirectory(directory: string) {
    const folderExist = fs.existsSync(directory) && fs.statSync(directory).isDirectory();
    if (folderExist) {
        fs.rmdirSync(directory, {recursive: true});
    }
    fs.mkdirSync(directory, {recursive: true});
}
