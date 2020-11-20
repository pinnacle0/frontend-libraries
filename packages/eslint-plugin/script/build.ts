import {PrettierUtil, TaskRunner, Utility} from "@pinnacle0/devtool-util/src";
import path from "path";

const FilePath = {
    project: path.join(__dirname, ".."),
    config: path.join(__dirname, "../config"),
    dist: path.join(__dirname, "../dist"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),

    projectESLintRc: path.join(__dirname, "../.eslintrc.js"),
    workspaceRootESLintIgnore: path.join(__dirname, "../../../.eslintignore"),
    jestConfig: path.join(__dirname, "../config/jest.config.js"),
    srcIndexTs: path.join(__dirname, "../src/index.ts"),
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
        name: "prepare dist directory",
        execute: () => {
            Utility.prepareEmptyDirectory(FilePath.dist);
        },
    },
    {
        name: "compile with parcel",
        execute: () => {
            Utility.runCommand("parcel", ["build", FilePath.srcIndexTs, "--no-autoinstall"]);
        },
    },
]);
