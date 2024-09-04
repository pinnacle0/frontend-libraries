import {PrettierUtil, TaskRunner, Utility} from "@pinnacle0/devtool-util";
import fs from "fs";
import path from "path";

const FilePath = {
    project: path.join(__dirname, ".."),
    config: path.join(__dirname, "../config"),
    build: path.join(__dirname, "../build"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    jestConfig: path.join(__dirname, "../config/jest.config.ts"),
    tsConfigForProjectReferences: path.join(__dirname, "../tsconfig.json"), // Use `--build` instead of `--project`
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectReadMe: path.join(__dirname, "../README.md"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildReadMe: path.join(__dirname, "../build/README.md"),
    buildLicense: path.join(__dirname, "../build/LICENSE.md"),
};

new TaskRunner("build").execute([
    {
        name: "check code style",
        skipInFastMode: true,
        execute: () => {
            PrettierUtil.check(FilePath.config);
            PrettierUtil.check(FilePath.script);
            PrettierUtil.check(FilePath.src);
            PrettierUtil.check(FilePath.test);
        },
    },
    {
        name: "lint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("eslint", ["--no-warn-ignored", `"${FilePath.src}/**"`]);
            Utility.runCommand("eslint", ["--no-warn-ignored", `"${FilePath.test}/**"`]);
        },
    },
    {
        name: "test",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("jest", ["--config", FilePath.jestConfig, "--bail", "--coverage"]);
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
            Utility.runCommand("tsc", ["--build", FilePath.tsConfigForProjectReferences]);
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
