import {TaskRunner} from "./TaskRunner";
import {Utility} from "./Utility";
import {PrettierUtil} from "./PrettierUtil";

// TODO/Lok: add simple description about React-Native project requirement (e.g: /app folder, index.js, typescript-based ...)
//  then review this part of code, apply to pgaming/ub app project

export class ReactNativeChecker {
    private readonly projectPath: string;

    constructor({projectPath}: {projectPath: string}) {
        this.projectPath = projectPath;
    }

    run() {
        new TaskRunner("ReactNativeChecker").execute([
            {
                name: "check package.json",
                skipInFastMode: true,
                execute: () => {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require -- package.json special case
                    const localDeps = require(`${this.projectPath}/package.json`).dependencies;
                    if (Object.values(localDeps).some(version => !/^\d/.test(String(version)))) {
                        throw new Error("Project dependency must be a valid npm version");
                    }
                },
            },
            {
                name: "prettier",
                skipInFastMode: true,
                execute: () => {
                    PrettierUtil.check(`${this.projectPath}/app`);
                    PrettierUtil.check(`${this.projectPath}/index.js`);
                },
            },
            {
                name: "lint",
                skipInFastMode: true,
                execute: () => {
                    Utility.runCommand("eslint", ["--ext", ".ts,.tsx", `${this.projectPath}/app`]);
                    Utility.runCommand("eslint", [`${this.projectPath}/index.js`]);
                },
            },
            {
                name: "tsc compile",
                execute: () => {
                    Utility.runCommand("tsc", ["--project", `${this.projectPath}/tsconfig.json`]);
                },
            },
        ]);
    }
}
