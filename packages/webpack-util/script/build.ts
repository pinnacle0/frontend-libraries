import path from "path";
import {PrettierUtil, Utility, TaskRunner} from "@pinnacle0/devtool-util/src";

const FilePath = {
    config: path.join(__dirname, "../config"),
    dist: path.join(__dirname, "../dist"),
    script: path.join(__dirname, "../script"),
    src: path.join(__dirname, "../src"),
    tsConfigForSrc: path.join(__dirname, "../config/tsconfig.src.json"),
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
            Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", FilePath.src]);
        },
    },
    {
        name: "prepare /dist folder",
        execute: () => {
            Utility.prepareEmptyDirectory(FilePath.dist);
        },
    },
    {
        name: "tsc compile",
        execute: () => {
            Utility.runCommand("tsc", ["--project", FilePath.tsConfigForSrc]);
        },
    },
]);
