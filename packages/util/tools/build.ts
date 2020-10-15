import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import {pathMap} from "../config/path-map";
import checkFormat from "./check-format";
import lint from "./lint";
import {createPrint, runCommand} from "./util";

const {projectDirectory, distDirectory, configDirectory} = pathMap;
const print = createPrint("build");
const isFastMode = yargs.argv.mode === "fast";

export default function build() {
    if (isFastMode) {
        print.info("Fast mode enabled, skipping format checking and testing");
    } else {
        print.task("Check code style");
        checkFormat();

        print.task("Check lint");
        lint();

        print.task("Run tests");
        runCommand(
            String.raw`yarn run \
            --cwd="${projectDirectory}" \
            jest \
            --config "${configDirectory}/jest.config.js" \
            --coverage \
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
            tsc --build "${projectDirectory}/tsconfig.json"`
        );
    }
    {
        print.task("Deleting tsbuildinfo files");
        fs.readdirSync("dist", {encoding: "utf8"})
            .filter(file => file.toLowerCase().endsWith(".tsbuildinfo"))
            .map(file => path.join("dist", file))
            .forEach(file => fs.unlinkSync(file));
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
