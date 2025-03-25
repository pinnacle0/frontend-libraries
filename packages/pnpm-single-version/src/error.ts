import chalk from "chalk";
import {PACKAGE_JSON_OPTIONS_KEY} from "./constant.js";

export class ProjectRootError extends Error {
    constructor() {
        super("Can not find project root");
        this.name = "ProjectRootError";
    }
}

export class PackageJsonNotFoundError extends Error {
    constructor() {
        super(`Unable to read package.json of root project `);
        this.name = "PackageJsonNotFoundError";
    }
}

export class OptionNotFoundError extends Error {
    constructor() {
        super(`Unable to find option ${chalk.blueBright(`'${PACKAGE_JSON_OPTIONS_KEY}'`)} in package.json of root project `);
        this.name = "OptionsNotFound";
    }
}

export class OptionSyntaxError extends Error {
    constructor(message: string) {
        super(`Invalid option: ${message}`);
        this.name = "OptionSyntaxError";
    }
}

export class LockFileError extends Error {
    constructor() {
        super("Unable to read lock file");
    }
}

export class LockfilePackagesMissingError extends Error {
    constructor() {
        super(`'packages' in lockfile is missing`);
        this.name = "LockfilePackagesMissingError";
    }
}
