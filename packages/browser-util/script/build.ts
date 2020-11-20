import {PrettierUtil, TaskRunner, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";

const FilePath = {
    config: path.join(__dirname, "../config"),
    build: path.join(__dirname, "../build"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    jestConfig: path.join(__dirname, "../config/jest.config.js"),
    tsConfigForSrc: path.join(__dirname, "../config/tsconfig.src.json"),
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildLicense: path.join(__dirname, "../build/LICENSE.md"),
};

new TaskRunner("build").execute([
    {
        name: "check code styles",
        skipInFastMode: true,
        execute: () => {
            PrettierUtil.check(FilePath.config);
            PrettierUtil.check(FilePath.script);
            PrettierUtil.check(FilePath.src);
            PrettierUtil.check(FilePath.test);
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
        name: 'prepare "build" directory',
        execute: () => {
            Utility.prepareEmptyDirectory(FilePath.build);
        },
    },
    {
        name: "tsc compile",
        execute: () => {
            Utility.runCommand("tsc", ["--project", FilePath.tsConfigForSrc]);
        },
    },
    {
        name: "copy package.json, markdown files",
        execute: () => {
            fs.copyFileSync(FilePath.projectPackageJSON, FilePath.buildPackageJSON);
            fs.copyFileSync(FilePath.projectLicense, FilePath.buildLicense);
        },
    },
]);
