import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";
import yargs from "yargs";

const print = Utility.createConsoleLogger("build");
const isFastMode = yargs.argv.mode === "fast";
const directory = {
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
    print.task("Check code style");
    PrettierUtil.check(directory.config);
    PrettierUtil.check(directory.script);
    PrettierUtil.check(directory.src);
    PrettierUtil.check(directory.test);

    print.task("Check lint");
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", directory.src]);
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", directory.test]);

    print.task("Run tests");
    Utility.runCommand("jest", ["--config", path.join(directory.config, "jest.config.js"), "--bail", "--coverage"]);
}

print.task("Cleaning dist directory");
if (fs.existsSync(directory.dist) && fs.statSync(directory.dist).isDirectory()) {
    fs.rmdirSync(directory.dist, {recursive: true});
}
fs.mkdirSync(directory.dist, {recursive: true});

print.task("Compiling...");
Utility.runCommand("tsc", ["--build", path.join(directory.project, "tsconfig.json")]);

// TODO: remove this
print.task("Writing package.json to dist folder");
const packageJsonContents = JSON.parse(fs.readFileSync(path.join(directory.project, "package.json"), {encoding: "utf8"}));
delete packageJsonContents.private; // Make `dist/package.json` publishable
fs.writeFileSync(path.join(directory.dist, "package.json"), JSON.stringify(packageJsonContents, null, 4), {encoding: "utf8"});

print.task("Copying markdown files to dist folder");
fs.copyFileSync(path.join(directory.project, "package.json"), path.join(directory.dist, "package.json"));
fs.copyFileSync(path.join(directory.project, "README.md"), path.join(directory.dist, "README.md"));
fs.copyFileSync(path.join(directory.project, "LICENSE.md"), path.join(directory.dist, "LICENSE.md"));

print.info("Build successful");
