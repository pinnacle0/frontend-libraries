import {PrettierUtil} from "@pinnacle0/devtool-util/src/PrettierUtil";
import {Utility} from "@pinnacle0/devtool-util/src/Utility";
import fs from "fs";
import path from "path";

const projectDirectory = path.join(__dirname, "..");

export default function build() {
    PrettierUtil.check(path.join(projectDirectory, "src"));
    PrettierUtil.check(path.join(projectDirectory, "tools"));

    const distDirectory = path.join(projectDirectory, "dist");
    if (fs.existsSync(distDirectory)) {
        fs.rmdirSync(distDirectory, {recursive: true});
    }

    Utility.runCommand("tsc", ["--project", path.join(projectDirectory, "tsconfig.json")]);
}
