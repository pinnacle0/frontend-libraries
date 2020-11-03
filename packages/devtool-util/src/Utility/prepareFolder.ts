import * as fs from "fs-extra";
import {createConsoleLogger} from "./createConsoleLogger";

const print = createConsoleLogger("prepareFolder");

export async function prepareFolder(directory: string) {
    print.task(directory);
    const folderExist = await fs.pathExists(directory);
    if (!folderExist) {
        await fs.mkdir(directory);
    }
    await fs.emptyDir(directory);
}
