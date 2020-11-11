import {PrettierUtil} from "@pinnacle0/devtool-util/src/PrettierUtil";
import {Utility} from "@pinnacle0/devtool-util/src/Utility";
import fs from "fs";
import path from "path";

const print = Utility.createConsoleLogger("build");

const projectDirectory = path.join(__dirname, "..");

export default function build() {
    print.task("Checking code styles");
    PrettierUtil.check(path.join(projectDirectory, "src"));
    PrettierUtil.check(path.join(projectDirectory, "tools"));

    const distDirectory = path.join(projectDirectory, "dist");
    if (fs.existsSync(distDirectory)) {
        print.task("Removing dist directory");
        fs.rmdirSync(distDirectory, {recursive: true});
    }

    print.task("Compiling...");
    Utility.runCommand("tsc", ["--project", path.join(projectDirectory, "tsconfig.json")]);

    print.info("Build successful");
}
