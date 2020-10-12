import * as fs from "fs-extra";
import * as path from "path";
import yargs from "yargs";
import {pathMap} from "../config/path-map";
import checkFormat from "./check-format";
import lint from "./lint";
import {createPrint, runCommand} from "./util";

const {projectDirectory, distDirectory} = pathMap;

const print = createPrint("build.ts");

export default function build() {
    const isFastMode = yargs.argv.mode === "fast";
    if (isFastMode) {
        print.info("Fast mode enabled, skipping format checking and testing");
    } else {
        checkFormat();
        lint();
        runCommand(
            String.raw`yarn run \
            --cwd="${projectDirectory}" \
            jest \
            --config ${path.join(pathMap.configDirectory, "jest.config.js")} \
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
            String.raw`yarn run \
            --cwd="${projectDirectory}" \
            parcel build src/index.ts \
            --no-autoinstall`
        );
    }
    print.info("Finishing...");
}
