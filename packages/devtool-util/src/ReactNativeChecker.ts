import fs from "fs";
import {PrettierUtil} from "./PrettierUtil";
import {TaskRunner} from "./TaskRunner";
import {Utility} from "./Utility";

interface ReactNativeCheckerOptions {
    projectDirectory: string;
    extraCheckDirectories?: string[];
}

/**
 * Runs static checkers in a react-native project.
 * Checks version of packages should be exact version.
 * Checks code styles with prettier.
 * Lints .ts,.tsx with eslint.
 * Type checks with tsc.
 *
 * Constructor arguments:
 * - `projectDirectory`: directory with the following structure
 *   ```
 *   projectDirectory/
 *   ├── app/
 *   ├── index.js
 *   ├── tsconfig.json
 *   └── package.json
 *   ```
 * - `extraCheckDirectories`: extra directories that should be checked by
 *   prettier, eslint; and also tsc if `tsconfig.json` is found.
 *
 * A prettier and eslint config should be resolvable from `projectDirectory`.
 * The `app` directory should contain typescript files.
 */
export class ReactNativeChecker {
    private readonly projectDirectory: string;
    private readonly extraCheckDirectories: string[];

    constructor({projectDirectory, extraCheckDirectories}: ReactNativeCheckerOptions) {
        this.projectDirectory = projectDirectory;
        this.extraCheckDirectories = extraCheckDirectories ?? [];
    }

    run() {
        new TaskRunner("ReactNativeChecker").execute([
            {
                name: "check package.json",
                skipInFastMode: true,
                execute: () => {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require -- package.json special case
                    const localDeps = require(`${this.projectDirectory}/package.json`).dependencies;
                    if (Object.values(localDeps).some(version => !/^\d/.test(String(version)))) {
                        throw new Error("Project dependency must be a valid npm version");
                    }
                },
            },
            {
                name: "prettier",
                skipInFastMode: true,
                execute: () => {
                    PrettierUtil.check(`${this.projectDirectory}/app`);
                    PrettierUtil.check(`${this.projectDirectory}/index.js`);
                    this.extraCheckDirectories.forEach(directory => PrettierUtil.check(directory));
                },
            },
            {
                name: "lint",
                skipInFastMode: true,
                execute: () => {
                    Utility.runCommand("eslint", ["--ext", ".ts,.tsx", `${this.projectDirectory}/app`]);
                    Utility.runCommand("eslint", [`${this.projectDirectory}/index.js`]);
                    this.extraCheckDirectories.forEach(directory => Utility.runCommand("eslint", ["--ext", ".ts,.tsx", directory]));
                },
            },
            {
                name: "tsc compile",
                execute: () => {
                    Utility.runCommand("tsc", ["--project", `${this.projectDirectory}/tsconfig.json`, "--noEmit"]);
                    this.extraCheckDirectories.forEach(directory => {
                        if (fs.existsSync(`${directory}/tsconfig.json`)) {
                            Utility.runCommand("tsc", ["--project", `${directory}/tsconfig.json`, "--noEmit"]);
                        }
                    });
                },
            },
        ]);
    }
}
