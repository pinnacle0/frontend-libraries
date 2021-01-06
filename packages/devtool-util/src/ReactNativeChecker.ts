import {PrettierUtil} from "./PrettierUtil";
import {TaskRunner} from "./TaskRunner";
import {Utility} from "./Utility";

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
 *
 * A prettier and eslint config should be resolvable from `projectDirectory`.
 * The `app` directory should contain typescript files.
 */
export class ReactNativeChecker {
    private readonly projectDirectory: string;

    constructor({projectDirectory}: {projectDirectory: string}) {
        this.projectDirectory = projectDirectory;
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
                },
            },
            {
                name: "lint",
                skipInFastMode: true,
                execute: () => {
                    Utility.runCommand("eslint", ["--ext", ".ts,.tsx", `${this.projectDirectory}/app`]);
                    Utility.runCommand("eslint", [`${this.projectDirectory}/index.js`]);
                },
            },
            {
                name: "tsc compile",
                execute: () => {
                    Utility.runCommand("tsc", ["--project", `${this.projectDirectory}/tsconfig.json`, "--noEmit"]);
                },
            },
        ]);
    }
}
