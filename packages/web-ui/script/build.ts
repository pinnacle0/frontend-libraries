import {PrettierUtil, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs-extra";
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
    print.task("Checking code styles");
    PrettierUtil.check(directory.config);
    PrettierUtil.check(directory.script);
    PrettierUtil.check(directory.src);
    PrettierUtil.check(directory.test);

    print.task("Checking lint for js/ts");
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", directory.src]);
    Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", directory.test]);

    print.task("Checking lint for stylesheets");
    Utility.runCommand("stylelint", [path.join(directory.src, "**/*.{css,less}")]);
    Utility.runCommand("stylelint", [path.join(directory.test, "**/*.{css,less}")]);

    print.task("Running unit tests");
    Utility.runCommand("jest", ["--config", path.join(directory.config, "jest.config.js")]);
}

print.task("Compiling...");
Utility.runCommand("tsc", ["--project", path.join(directory.config, "tsconfig.src.json")]);

print.task("Copying assets to dist directory");
const supportedExtensions = [".less", ".css", ".json", ".jpg", ".png", ".gif", ".mp3", ".mp4", ".wmv"];
fs.copySync(directory.src, directory.dist, {
    filter: source => {
        const extension = path.extname(source);
        // source may be a directory or a file under the directory.
        if (fs.statSync(source).isDirectory()) {
            return true;
        } else if (supportedExtensions.includes(extension)) {
            print.info(`Asset (${extension}) copied from "${path.relative(directory.src, source)}"`);
            return true;
        } else {
            if (extension !== ".tsx" && extension !== ".ts") {
                print.error(`Asset (${extension}) is unsupported, skipped "${path.relative(directory.src, source)}"`);
            }
            return false;
        }
    },
    dereference: true,
});

print.task("Writing package.json to dist folder");
const packageJsonContents = JSON.parse(fs.readFileSync(path.join(directory.project, "package.json"), {encoding: "utf8"}));
delete packageJsonContents.private; // Make `dist/package.json` publishable
fs.writeFileSync(path.join(directory.dist, "package.json"), JSON.stringify(packageJsonContents, null, 4), {encoding: "utf8"});

print.task("Copying markdown files to dist folder");
fs.copySync(path.join(directory.project, "README.md"), path.join(directory.dist, "README.md"), {dereference: true});
fs.copySync(path.join(directory.project, "LICENSE.md"), path.join(directory.dist, "LICENSE.md"), {dereference: true});
