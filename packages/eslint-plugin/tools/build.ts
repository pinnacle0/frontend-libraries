import * as fs from "fs-extra";
import * as path from "path";
import yargs from "yargs";
import checkFormat from "./check-format";
import lint from "./lint";
import {paths} from "./paths";
import {runCommand} from "./run-command";
import {createPrint} from "./util";

const {projectDirectory, distDirectory} = paths;

const print = createPrint("build.ts");

export default function build() {
    const isFastMode = yargs.argv.mode === "fast";
    if (isFastMode) {
        print.info("Fast mode enabled, skipping format checking and testing");
    } else {
        checkFormat();
        lint();
        runCommand(
            String.raw`yarn run jest \
            --config ${path.join(paths.configDirectory, "jest.config.js")} \
            --runInBand`
        );
    }
    {
        print.task("Cleaning dist directory");
        if (fs.existsSync(distDirectory) && fs.statSync(distDirectory).isDirectory()) {
            fs.removeSync(distDirectory);
        }
    }
    {
        print.task("Compiling...");
        runCommand(
            String.raw`yarn run tsc \
            --project ${path.join(projectDirectory, "tsconfig.json")}`
        );
    }
    print.info("Finishing...");
}
