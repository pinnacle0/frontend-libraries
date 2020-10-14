import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import {pathMap} from "../config/path-map";
import checkFormat from "./check-format";
import lint from "./lint";
import {createPrint, runCommand} from "./util";

const {projectDirectory, srcDirectory, distDirectory, configDirectory, srcTsconfigFile} = pathMap;

const print = createPrint("build");

export default function build() {
    const isFastMode = yargs.argv.mode === "fast";
    if (isFastMode) {
        print.info("Fast mode enabled, skipping format checking and testing");
    } else {
        print.task("Check code style");
        checkFormat();

        print.task("Check lint");
        lint();

        print.task("Run unit tests");
        runCommand(
            String.raw`yarn run \
            --cwd="${projectDirectory}" \
            jest --config ${configDirectory}/jest.config.js`
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
            tsc --project ${srcTsconfigFile}`
        );
    }
    {
        print.task("Copying assets to dist directory");
        const supportedExtensions = [".less", ".css", ".json", ".jpg", ".png", ".gif", ".mp3", ".mp4", ".wmv"];
        fs.copySync(srcDirectory, distDirectory, {
            filter: source => {
                const extension = path.extname(source);
                // source may be a directory or a file under the directory.
                if (fs.statSync(source).isDirectory()) {
                    return true;
                } else if (supportedExtensions.includes(extension)) {
                    print.info(`Asset (${extension}) copied from "${path.relative(srcDirectory, source)}"`);
                    return true;
                } else {
                    if (extension !== ".tsx" && extension !== ".ts") {
                        print.error(`Asset (${extension}) is unsupported, skipped "${path.relative(srcDirectory, source)}"`);
                    }
                    return false;
                }
            },
            dereference: true,
        });
    }
    {
        print.task("Copying package.json, markdown files to dist folder");
        fs.copySync("package.json", path.join(distDirectory, "package.json"), {dereference: true});
        fs.copySync("README.md", path.join(distDirectory, "README.md"), {dereference: true});
        fs.copySync("LICENSE.md", path.join(distDirectory, "LICENSE.md"), {dereference: true});
    }

    print.info("Build successful");
    print.info(["To publish, run the following command:", "\n", `$ cd ${distDirectory}`, "\n", `$ yarn publish`]);
}
