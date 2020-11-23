import {PrettierUtil, TaskRunner, Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";

const FilePath = {
    project: path.join(__dirname, ".."),
    config: path.join(__dirname, "../config"),
    build: path.join(__dirname, "../build"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    projectESLintRc: path.join(__dirname, "../.eslintrc.js"),
    workspaceRootESLintIgnore: path.join(__dirname, "../../../.eslintignore"),
    jestConfig: path.join(__dirname, "../config/jest.config.js"),
    rollupConfig: path.join(__dirname, "../config/rollup.config.js"),
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectReadMe: path.join(__dirname, "../README.md"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildReadMe: path.join(__dirname, "../build/README.md"),
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
        name: "lint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("eslint", ["--ext", ".js,.jsx,.ts,.tsx", "--config", FilePath.projectESLintRc, "--ignore-path", FilePath.workspaceRootESLintIgnore, FilePath.project]);
        },
    },
    {
        name: "test",
        skipInFastMode: true,
        execute: () => {
            // TODO/Lok: Add this back
            // Utility.runCommand("jest", ["--config", "config/jest.config.js"]);
        },
    },
    {
        name: "prepare build directory",
        execute: () => {
            Utility.prepareEmptyDirectory(FilePath.build);
        },
    },
    {
        name: "compile with rollup",
        execute: () => {
            Utility.runCommand("rollup", ["--config", FilePath.rollupConfig]);
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
