import {Utility} from "./Utility";
import fs from "fs";

interface VersionCheckerOptions {
    projectDirectory: string;
    skipLibs?: string[];
}

/** There are many fields in the response, but we only need these two */
interface NPMPackageAJAXResponse {
    _id: string;
    "dist-tags": {
        latest: string;
        beta: string;
    };
}

// TODO: Check local dependencies version instead

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
    private readonly logger = Utility.createConsoleLogger("VersionChecker");
    // Assuming all of our packages are using npm js registry
    private readonly registry_url = "https://registry.npmjs.org";
    private packages: {
        [key: string]: string;
    } = {};

    constructor({projectDirectory, skipLibs}: VersionCheckerOptions) {
        this.projectDirectory = projectDirectory;
        this.skipLibs = skipLibs ?? [];
    }

    run() {
        try {
            /**
             * 1. Resolve package.json
             * 2. Extract (dev) dependencies' name & version
             * 3. Parallel fetch all meta data from registry
             * 4. Compare all version tags
             */
            this.resolvePackageJson();
            this.extractDependencies();
            this.fetchAndValidatePackageVersion();
        } catch (e) {
            this.logger.error(e);
            process.exit(1);
        }
    }

    private resolvePackageJson() {
        if (!fs.existsSync(this.projectDirectory + "/package.json")) throw new Error(`Package.json does not exist in [${this.projectDirectory}]`);
    }

    private extractDependencies() {
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
    }

    private fetchAndValidatePackageVersion() {
        Object.entries(this.packages).map(async ([packageName, version]) => {
            const latest_version = this.fetchVersion(packageName);
            if (version !== latest_version) throw new Error(`Package version is not match. [${packageName}]: ${version} -> ${latest_version}`);
        });
    }

    private fetchVersion(packageName: string) {
        const packagePath = require.resolve(`${packageName}/package.json`, {
            paths: [this.projectDirectory],
        });
        const packageJson = require(packagePath);
        return packageJson.version;
    }
}
