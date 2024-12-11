import {PrettierUtil} from "@pinnacle0/devtool-util/PrettierUtil";
import {Utility} from "@pinnacle0/devtool-util/Utility";
import {TaskRunner} from "@pinnacle0/devtool-util/TaskRunner";
import fs from "fs";
import path from "path";

const FilePath = {
    project: path.join(import.meta.dirname, ".."),
    config: path.join(import.meta.dirname, "../config"),
    build: path.join(import.meta.dirname, "../build"),
    script: path.join(import.meta.dirname, "../script"),
    src: path.join(import.meta.dirname, "../src"),
    test: path.join(import.meta.dirname, "../test"),

    vitestConfig: path.join(import.meta.dirname, "../config/vitest.config.ts"),
    tsConfigForSrc: path.join(import.meta.dirname, "../config/tsconfig.src.json"),
    projectPackageJSON: path.join(import.meta.dirname, "../package.json"),
    projectReadMe: path.join(import.meta.dirname, "../README.md"),
    projectLicense: path.join(import.meta.dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(import.meta.dirname, "../build/package.json"),
    buildReadMe: path.join(import.meta.dirname, "../build/README.md"),
    buildLicense: path.join(import.meta.dirname, "../build/LICENSE.md"),
};

new TaskRunner("build").execute([
    {
        name: "prettier",
        skipInFastMode: true,
        execute: () => {
            PrettierUtil.check(FilePath.config);
            PrettierUtil.check(FilePath.script);
            PrettierUtil.check(FilePath.src);
            PrettierUtil.check(FilePath.test);
        },
    },
    {
        name: "eslint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("eslint", ["--no-warn-ignored", `"${FilePath.src}/**"`]);
            Utility.runCommand("eslint", ["--no-warn-ignored", `"${FilePath.test}/**"`]);
        },
    },
    {
        name: "stylelint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("stylelint", [path.join(FilePath.src, "**/*.{css,less}")]);
            Utility.runCommand("stylelint", [path.join(FilePath.test, "**/*.{css,less}")]);
        },
    },
    {
        name: "unit test",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("vitest", ["--config", FilePath.vitestConfig, "--run"]);
        },
    },
    {
        name: "prepare build directory",
        execute: () => {
            Utility.prepareEmptyDirectory(FilePath.build);
        },
    },
    {
        name: "compile with tsc",
        execute: () => {
            Utility.runCommand("tsc", ["--build", FilePath.tsConfigForSrc]);
        },
    },
    {
        name: "copy assets to build directory",
        execute: () => {
            const print = Utility.createConsoleLogger("build");
            const supportedExtensions = [".less", ".css", ".json", ".jpg", ".png", ".gif", ".mp3", ".mp4", ".wmv"];
            fs.cpSync(FilePath.src, FilePath.build, {
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
                recursive: true,
            });
        },
    },
    {
        name: "copy package.json, markdown files",
        execute: () => {
            fs.copyFileSync(FilePath.projectPackageJSON, FilePath.buildPackageJSON);
            fs.copyFileSync(FilePath.projectReadMe, FilePath.buildReadMe);
            fs.copyFileSync(FilePath.projectLicense, FilePath.buildLicense);
        },
    },
]);
