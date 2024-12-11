import {PrettierUtil} from "@pinnacle0/devtool-util/PrettierUtil";
import {Utility} from "@pinnacle0/devtool-util/Utility";
import fs from "fs";
import path from "path";
import type {InternalCheckerOptions} from "./type";

export class CodeStyleChecker {
    private readonly checkableSrcDirectories: [string, ...string[]];
    private readonly logger = Utility.createConsoleLogger("CodeStyleChecker");

    constructor({projectDirectory, extraCheckDirectories = []}: InternalCheckerOptions) {
        this.checkableSrcDirectories = [path.join(projectDirectory, "src")];
        for (const directory of extraCheckDirectories) {
            const others = ["test", "script"].map(folder => path.join(directory, folder)).filter(path => fs.existsSync(path));
            this.checkableSrcDirectories.push(path.join(directory, "src"), ...others);
        }
    }

    run() {
        this.checkPrettier();
        this.checkESLint();
        this.checkStylelint();
    }

    private checkPrettier() {
        this.logger.task("Checking Prettier");
        for (const srcDirectory of this.checkableSrcDirectories) {
            PrettierUtil.check(srcDirectory);
        }
    }

    private checkESLint() {
        this.logger.task("Checking ESLint");
        for (const srcDirectory of this.checkableSrcDirectories) {
            Utility.runCommand("eslint", ["--no-warn-ignored", "--no-error-on-unmatched-pattern", "--max-warnings=1", `"${srcDirectory}/**"`]);
        }
    }

    private checkStylelint() {
        this.logger.task("Checking Stylelint");
        for (const srcDirectory of this.checkableSrcDirectories) {
            Utility.runCommand("stylelint", ["--allow-empty-input", "--max-warnings=1", path.join(srcDirectory, "**/*.{css,less}")]);
        }
    }
}
