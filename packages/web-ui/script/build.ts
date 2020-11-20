import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import {copySync as fsExtraCopySync} from "fs-extra";
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
    tsConfigForSrc: path.join(__dirname, "../config/tsconfig.src.json"),
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectReadMe: path.join(__dirname, "../README.md"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
};

if (isFastMode) {
    print.info("Fast mode enabled, skipping format checking and testing");
} else {
    print.task("Checking code styles");
    PrettierUtil.check(FilePath.config);
    PrettierUtil.check(FilePath.script);
    PrettierUtil.check(FilePath.src);
    PrettierUtil.check(FilePath.test);

    print.task("Checking lint for js/ts");
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", FilePath.src]);
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", FilePath.test]);

    print.task("Checking lint for stylesheets");
    Utility.runCommand("stylelint", [path.join(FilePath.src, "**/*.{css,less}")]);
    Utility.runCommand("stylelint", [path.join(FilePath.test, "**/*.{css,less}")]);

    print.task("Running unit tests");
    Utility.runCommand("jest", ["--config", FilePath.jestConfig, "--bail"]);
}

print.task("Preparing dist directory");
Utility.prepareEmptyDirectory(FilePath.dist);

print.task("Compiling");
Utility.runCommand("tsc", ["--project", FilePath.tsConfigForSrc]);

print.task("Copying assets to dist directory");
const supportedExtensions = [".less", ".css", ".json", ".jpg", ".png", ".gif", ".mp3", ".mp4", ".wmv"];
fsExtraCopySync(FilePath.src, FilePath.dist, {
    filter: source => {
        const extension = path.extname(source);
        // source may be a directory or a file under the directory.
        if (fs.statSync(source).isDirectory()) {
            return true;
        } else if (supportedExtensions.includes(extension)) {
            print.info(`Asset (${extension}) copied from "${path.relative(FilePath.src, source)}"`);
            return true;
        } else {
            if (extension !== ".tsx" && extension !== ".ts") {
                print.error(`Asset (${extension}) is unsupported, skipped "${path.relative(FilePath.src, source)}"`);
            }
            return false;
        }
    },
    dereference: true,
});

print.task("Copying package.json, markdown files to dist folder");
fs.copyFileSync(FilePath.projectPackageJSON, path.join(FilePath.dist, "package.json"));
fs.copyFileSync(FilePath.projectReadMe, path.join(FilePath.dist, "README.md"));
fs.copyFileSync(FilePath.projectLicense, path.join(FilePath.dist, "LICENSE.md"));

print.info("Build successful");
