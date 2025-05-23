import {Utility} from "@pinnacle0/devtool-util/Utility";
import {TaskRunner} from "@pinnacle0/devtool-util/TaskRunner";
import fs from "fs";
import path from "path";
import {PrettierUtil} from "@pinnacle0/devtool-util/PrettierUtil";

const FilePath = {
    project: path.join(import.meta.dirname, ".."),
    config: path.join(import.meta.dirname, "../config"),
    build: path.join(import.meta.dirname, "../build"),
    script: path.join(import.meta.dirname, "../script"),
    src: path.join(import.meta.dirname, "../src"),
    test: path.join(import.meta.dirname, "../test"),

    projectESLintConfig: path.join(import.meta.dirname, "../eslint.config.js"),
    workspaceRootESLintIgnore: path.join(import.meta.dirname, "../../../.eslintignore"),
    vitestConfig: path.join(import.meta.dirname, "../config/vitest.config.ts"),
    rollupConfig: path.join(import.meta.dirname, "../config/rollup.config.js"),
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
            Utility.runCommand("vitest", ["--run", "--config", FilePath.vitestConfig]);
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
