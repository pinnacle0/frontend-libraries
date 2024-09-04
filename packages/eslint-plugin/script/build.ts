import {PrettierUtil} from "@pinnacle0/devtool-util/src/PrettierUtil";
import {TaskRunner} from "@pinnacle0/devtool-util/src/TaskRunner";
import {Utility} from "@pinnacle0/devtool-util/src/Utility";
import fs from "fs";
import path from "path";

const FilePath = {
    project: path.join(__dirname, ".."),
    config: path.join(__dirname, "../config"),
    build: path.join(__dirname, "../build"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    projectESLintConfig: path.join(__dirname, "../eslint.config.js"),
    workspaceRootESLintIgnore: path.join(__dirname, "../../../.eslintignore"),
    jestConfig: path.join(__dirname, "../config/jest.config.ts"),
    rollupConfig: path.join(__dirname, "../config/rollup.config.ts"),
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectReadMe: path.join(__dirname, "../README.md"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildReadMe: path.join(__dirname, "../build/README.md"),
    buildLicense: path.join(__dirname, "../build/LICENSE.md"),
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
        name: "lint",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("eslint", ["-c", FilePath.projectESLintConfig, "--no-warn-ignored", `"${FilePath.src}/**"`]);
        },
    },
    {
        name: "test",
        skipInFastMode: true,
        execute: () => {
            Utility.runCommand("jest", ["--config", "config/jest.config.ts"]);
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
            Utility.runCommand("rollup", ["--config", FilePath.rollupConfig, "--bundleConfigAsCjs"]);
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
