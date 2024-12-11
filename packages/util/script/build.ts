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
    tsConfigForProjectReferences: path.join(import.meta.dirname, "../tsconfig.json"), // Use `--build` instead of `--project`
    projectPackageJSON: path.join(import.meta.dirname, "../package.json"),
    projectReadMe: path.join(import.meta.dirname, "../README.md"),
    projectLicense: path.join(import.meta.dirname, "../LICENSE.md"),
    buildPackageJSON: path.join(import.meta.dirname, "../build/package.json"),
    buildReadMe: path.join(import.meta.dirname, "../build/README.md"),
    buildLicense: path.join(import.meta.dirname, "../build/LICENSE.md"),
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
