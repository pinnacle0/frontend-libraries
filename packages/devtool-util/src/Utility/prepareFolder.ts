import * as fs from "fs";
import * as fsExtra from "fs-extra";

export async function prepareFolder(directory: string) {
    const folderExist = fs.existsSync(directory) && (await fs.promises.stat(directory)).isDirectory();
    if (!folderExist) {
        await fs.promises.mkdir(directory, {recursive: true});
    }
    // TODO/Lok: Maybe refactor to use fs.rmDir later? (Don't use fs.rm because it does not work on node 12)
    await fsExtra.emptyDir(directory);
}
