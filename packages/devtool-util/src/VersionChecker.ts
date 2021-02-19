import {TaskRunner} from "./TaskRunner";
import fs from "fs";

interface VersionCheckerOptions {
    projectDirectory: string;
    skipLibs?: string[];
}

/**
 * Start NPM Packages version checker, before starting Webpack Dev Server
 *
 * Constructor arguments:
 * - `projectDirectory`: project root folder contains package.json
 *  ```
 *  root/
 *  └── package.json
 *  ```
 *
 * - `skipLibs`: skip version checking if the array contains the package, Basically for monorepos
 *  For example:
 *      - @ub/shared
 *      - @ub/web-shared
 */
export class VersionChecker {
    private readonly projectDirectory: string;
    private readonly skipLibs: string[];
    private packages: Record<string, string> = {};

    constructor({projectDirectory, skipLibs}: VersionCheckerOptions) {
        this.projectDirectory = projectDirectory;
        this.skipLibs = skipLibs ?? [];
    }

    run() {
        new TaskRunner("VersionChecker").execute([
            {
                name: "Resolve package.json",
                skipInFastMode: true,
                execute: () => {
                    if (!fs.existsSync(this.projectDirectory + "/package.json")) throw new Error(`Package.json does not exist in [${this.projectDirectory}]`);
                },
            },
            {
                name: "Extract Dependencies",
                execute: () => {
                    // TODO/Jamyth: Refactor to use `require()`
                    const packageJson = fs.readFileSync(this.projectDirectory + "/package.json");
                    const json = JSON.parse(packageJson.toString("utf-8"));
                    const packages = {
                        ...json.devDependencies,
                        ...json.dependencies,
                    };
                    this.skipLibs.forEach(packageName => {
                        delete packages[packageName];
                    });
                    this.packages = packages;
                },
            },
            {
                name: "Validate Package Versions in node_modules",
                execute: () => {
                    Object.entries(this.packages).map(([packageName, version]) => {
                        const packagePath = require.resolve(`${packageName}/package.json`, {
                            paths: [this.projectDirectory],
                        });
                        const packageJson = require(packagePath);
                        const latest_version = packageJson.version;
                        if (version !== latest_version) throw new Error(`Package version is not match. [${packageName}]: ${version} -> ${latest_version}`);
                    });
                },
            },
        ]);
    }
}
