import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";

const print = Utility.createConsoleLogger("build");
const isFastMode = yargs.argv.mode === "fast";
const directory = {
    workspaceRoot: path.join(__dirname, "../../.."),
    project: path.join(__dirname, ".."),
    config: path.join(__dirname, "../config"),
    dist: path.join(__dirname, "../dist"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),
};

if (isFastMode) {
    print.info("Fast mode enabled, skipping format checking and testing");
} else {
    print.task("Checking code styles");
    PrettierUtil.check(directory.config);
    PrettierUtil.check(directory.script);
    PrettierUtil.check(directory.src);
    PrettierUtil.check(directory.test);

    print.task("Checking lint");
    Utility.runCommand("eslint", [
        "--ext",
        ".js,.jsx,.ts,.tsx",
        "--config",
        path.join(directory.project, ".eslintrc.js"),
        "--ignore-path",
        path.join(directory.workspaceRoot, ".eslintignore"),
        directory.project,
    ]);

    print.task("Running tests");
    Utility.runCommand("jest", ["--config", path.join(directory.config, "jest.config.js"), "--bail"]);
}

print.task("Cleaning dist directory");
if (fs.existsSync(directory.dist) && fs.statSync(directory.dist).isDirectory()) {
    fs.removeSync(directory.dist);
}

print.task("Compiling...");
Utility.runCommand("parcel", ["build", path.join(directory.src, "index.ts"), "--no-autoinstall"]);

print.info("Build successful");
