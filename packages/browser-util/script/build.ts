import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import path from "path";
import yargs from "yargs";

const print = Utility.createConsoleLogger("build");
const isFastMode = yargs.argv.mode === "fast";

if (isFastMode) {
    print.info("Fast mode enabled, skipping format checking and testing");
} else {
    print.task("Checking code styles");
    PrettierUtil.check(path.join(__dirname, "../src"));
    PrettierUtil.check(path.join(__dirname, "../script"));
    PrettierUtil.check(path.join(__dirname, "../test"));

    print.task("Running tests");
    Utility.runCommand("jest", ["--config", path.join(__dirname, "../config/jest.config.js"), "--bail"]);
}

print.task("Compiling...");
Utility.runCommand("tsc", ["--project", path.join(__dirname, "../config/tsconfig.src.json")]);

print.info("Build successful");
