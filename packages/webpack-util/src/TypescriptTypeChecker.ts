import {Utility} from "@pinnacle0/devtool-util";
import path from "path";
import type {InternalCheckerOptions} from "./type";

export class TypescriptTypeChecker {
    private readonly logger = Utility.createConsoleLogger("TypescriptTypeChecker");
    private checkableDirectories: string[];

    constructor({projectDirectory, extraCheckDirectories}: InternalCheckerOptions) {
        this.checkableDirectories = [projectDirectory, ...(extraCheckDirectories ?? [])];
    }

    run() {
        this.checkTypeScriptTyping();
    }

    private checkTypeScriptTyping() {
        this.logger.task("Checking TypeScript");
        for (const directory of this.checkableDirectories) {
            Utility.runCommand("tsc", ["--noEmit", "--emitDeclarationOnly", "false", "-P", path.join(directory, "tsconfig.json")]);
        }
    }
}
