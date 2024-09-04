import {PrettierUtil} from "@pinnacle0/devtool-util/build/PrettierUtil";
import {TaskRunner} from "@pinnacle0/devtool-util/build/TaskRunner";
import {Utility} from "@pinnacle0/devtool-util/build/Utility";
import fs from "fs";
import path from "path";

const FilePath = {
    config: path.join(__dirname, "../config"),
    build: path.join(__dirname, "../build"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),

    jestConfig: path.join(__dirname, "../config/jest.config.ts"),
    tsConfigForSrc: path.join(__dirname, "../config/tsconfig.src.json"),
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectReadMe: path.join(__dirname, "../README.md"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildReadMe: path.join(__dirname, "../build/README.md"),
    buildLicense: path.join(__dirname, "../build/LICENSE.md"),
};

new TaskRunner("build").execute([
    {
        name: "code style check",
        skipInFastMode: true,
        execute: () => {
            PrettierUtil.check(FilePath.config);
            PrettierUtil.check(FilePath.script);
            PrettierUtil.check(FilePath.src);
        },
    },
    {
        name: "lint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("eslint", ["--no-warn-ignored", `"${FilePath.src}/**"`]);
        },
    },
    {
        name: "test",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("jest", ["--config", FilePath.jestConfig, "--bail"]);
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
            Utility.runCommand("tsc", ["--project", FilePath.tsConfigForSrc]);
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
