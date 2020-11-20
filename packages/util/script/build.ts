import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";
import yargs from "yargs";

const print = Utility.createConsoleLogger("build");
const isFastMode = yargs.argv.mode === "fast";
const FilePath = {
    project: path.join(__dirname, ".."),
    config: path.join(__dirname, "../config"),
    dist: path.join(__dirname, "../dist"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    jestConfig: path.join(__dirname, "../config/jest.config.js"),
    tsConfigForProjectReferences: path.join(__dirname, "../tsconfig.json"), // Use `--build` instead of `--project`
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectReadMe: path.join(__dirname, "../README.md"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    distPackageJSON: path.join(__dirname, "../dist/package.json"),
    distReadMe: path.join(__dirname, "../dist/README.md"),
    distLicense: path.join(__dirname, "../dist/LICENSE.md"),
};

if (isFastMode) {
    print.info("Fast mode enabled, skipping format checking and testing");
} else {
    print.task("Check code style");
    PrettierUtil.check(FilePath.config);
    PrettierUtil.check(FilePath.script);
    PrettierUtil.check(FilePath.src);
    PrettierUtil.check(FilePath.test);

    print.task("Check lint");
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", FilePath.src]);
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", FilePath.test]);

    print.task("Run tests");
    Utility.runCommand("jest", ["--config", FilePath.jestConfig, "--bail", "--coverage"]);
}

print.task("Preparing dist directory");
Utility.prepareEmptyDirectory(FilePath.dist);

print.task("Compiling");
Utility.runCommand("tsc", ["--build", FilePath.tsConfigForProjectReferences]);

print.task("Copying package.json and markdown files to dist folder");
fs.copyFileSync(FilePath.projectPackageJSON, FilePath.distPackageJSON);
fs.copyFileSync(FilePath.projectReadMe, FilePath.distReadMe);
fs.copyFileSync(FilePath.projectLicense, FilePath.distLicense);

print.info("Build successful");
