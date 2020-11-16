import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";

const print = Utility.createConsoleLogger("build");

const directory = {
    project: path.join(__dirname, ".."),
    dist: path.join(__dirname, "../dist"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
};

print.task("Checking code styles");
PrettierUtil.check(directory.script);
PrettierUtil.check(directory.src);

print.task("Checking lint");
Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", directory.src]);

if (fs.existsSync(directory.dist)) {
    print.task("Removing dist directory");
    fs.rmdirSync(directory.dist, {recursive: true});
}

print.task("Compiling...");
Utility.runCommand("tsc", ["--project", path.join(directory.project, "tsconfig.json")]);

print.info("Build successful");
