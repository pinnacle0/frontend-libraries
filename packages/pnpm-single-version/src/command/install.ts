import fs from "fs";
import path from "path";
import {findProjectRoot} from "../parser-option/find-project-root.js";
import {Logger} from "../util/logger.js";

export const install = async () => {
    const root = await findProjectRoot();
    const psvDotFolderPath = path.join(root, ".psv");
    if (fs.existsSync(psvDotFolderPath)) {
        fs.rmSync(psvDotFolderPath, {force: true, recursive: true});
    }

    fs.mkdirSync(psvDotFolderPath);
    fs.copyFileSync(path.join(import.meta.dirname, "../hook-bundle.js"), path.join(psvDotFolderPath, "hook.js"));

    Logger.message("installed .psv");
};
