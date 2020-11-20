import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import path from "path";
import yargs from "yargs";

const print = Utility.createConsoleLogger("build");
const isFastMode = yargs.argv.mode === "fast";
const FilePath = {
    config: path.join(__dirname, "../config"),
    dist: path.join(__dirname, "../dist"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    jestConfig: path.join(__dirname, "../config/jest.config.js"),
    tsConfigForSrc: path.join(__dirname, "../config/tsconfig.src.json"),
};

if (isFastMode) {
    print.info("Fast mode enabled, skipping format checking and testing");
} else {
    print.task("Checking code styles");
    PrettierUtil.check(FilePath.config);
    PrettierUtil.check(FilePath.script);
    PrettierUtil.check(FilePath.src);
    PrettierUtil.check(FilePath.test);

    print.task("Running tests");
    Utility.runCommand("jest", ["--config", FilePath.jestConfig, "--bail"]);
}

print.task("Preparing dist directory");
Utility.prepareEmptyDirectory(FilePath.dist);

print.task("Compiling");
Utility.runCommand("tsc", ["--project", FilePath.tsConfigForSrc]);

print.info("Build successful");
