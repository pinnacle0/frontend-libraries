import {Utility} from "@pinnacle0/devtool-util";
import fs from "fs";

/**
 * `canadyarn` is a mono-repo package version checker for single version installation, developed by Pinnacle team.
 *
 * Ref: https://www.npmjs.com/package/canadyarn
 */
export class CanadyarnRunner {
    private readonly rootDirectory: string;
    private readonly logger = Utility.createConsoleLogger("CanadyarnRunner");

    constructor({rootDirectory}: {rootDirectory: string}) {
        this.rootDirectory = rootDirectory;
    }

    run() {
        this.runCanadyarn();
    }

    private runCanadyarn() {
        const packageJSONPath = this.rootDirectory + "/package.json";

        if (fs.existsSync(packageJSONPath) && fs.statSync(packageJSONPath).isFile()) {
            const packageJSONContents: Record<string, any> = JSON.parse(fs.readFileSync(packageJSONPath, {encoding: "utf8"}));

            if (packageJSONContents?.scripts?.canadyarn) {
                this.logger.task("Running `canadyarn` at " + this.rootDirectory);
                Utility.runCommand("yarn", ["--cwd", this.rootDirectory, "canadyarn"]);
            }
        } else {
            throw new Error(`Cannot load root directory [${this.rootDirectory}] package.json`);
        }
    }
}
