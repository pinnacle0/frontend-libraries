import {Utility} from "@pinnacle0/devtool-util/build/Utility";
import type {InternalCheckerOptions} from "./type";
import fs from "fs";

export class TestRunner {
    private readonly directories: [string, ...string[]];
    private readonly logger = Utility.createConsoleLogger("TestRunner");

    constructor({projectDirectory, extraCheckDirectories = []}: InternalCheckerOptions) {
        this.directories = [projectDirectory, ...extraCheckDirectories];
    }

    run() {
        this.directories.forEach(dir => this.runTestScript(dir));
    }

    private runTestScript(directory: string) {
        const packageJSONPath = directory + "/package.json";
        if (fs.existsSync(packageJSONPath) && fs.statSync(packageJSONPath).isFile()) {
            const packageJSONContents: Record<string, any> = JSON.parse(fs.readFileSync(packageJSONPath, {encoding: "utf8"}));

            if (packageJSONContents?.scripts?.test) {
                this.logger.task("Running `pnpm run test` at " + directory);
                Utility.runCommand("pnpm", ["--dir", directory, "run", "test"]);
            }
        }
    }
}
