import {Utility} from "@pinnacle0/devtool-util";
import path from "path";
import type {InternalCheckerOptions} from "./type";

/**
 * Check typescript type for both projectDirectory src, extraCheckDirectories src using their own tsconfig inside their directory
 */
export class TypescriptTypeChecker {
    private readonly logger = Utility.createConsoleLogger("TypescriptTypeChecker");
    private tsconfigPaths: string[] = [];

    constructor({projectDirectory, extraCheckDirectories}: InternalCheckerOptions) {
        const checkableDirectories = [projectDirectory, ...(extraCheckDirectories ?? [])];
        for (const directory of checkableDirectories) {
            this.tsconfigPaths.push(path.join(directory, "tsconfig.json"));
        }
    }

    run() {
        this.checkTypeScriptTyping();
    }

    private checkTypeScriptTyping() {
        this.logger.task("Checking TypeScript");
        for (const tsconfigPath of this.tsconfigPaths) {
            Utility.runCommand("tsc", ["--noEmit", "--emitDeclarationOnly", "false", "-P", tsconfigPath]);
        }
    }
}
