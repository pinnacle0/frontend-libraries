import fs from "fs";

interface Options {
    filepath: string;
}

/**
 * Checks if the package.json has exact dependency versions.
 * Checks if the package.json has no peerDeps and optionalDeps.
 */
export function checkPackageJson({filepath}: Options) {
    if (!(fs.existsSync(filepath) && fs.statSync(filepath).isFile())) {
        throw new Error(`Cannot find package.json at "${filepath}".`);
    }
    const contents: Record<string, any> = JSON.parse(fs.readFileSync(filepath, {encoding: "utf8"}));
    if (typeof contents.dependencies === "object" && !Array.isArray(contents.dependencies)) {
        Object.entries<string>(contents.dependencies).forEach(([name, version]) => {
            checkDependencyVersion({name, version, filepath});
        });
    }
    if (typeof contents.devDependencies === "object" && !Array.isArray(contents.devDependencies)) {
        Object.entries<string>(contents.devDependencies).forEach(([name, version]) => {
            checkDependencyVersion({name, version, filepath});
        });
    }
    if (typeof contents.peerDependencies === "object" && !Array.isArray(contents.peerDependencies)) {
        const peerDepsCount = Object.entries(contents.peerDependencies).length;
        if (peerDepsCount > 0) {
            throw new Error(`There should not be any peerDependencies in package.json at ${filepath}.`);
        }
    }
    if (typeof contents.optionalDependencies === "object" && !Array.isArray(contents.optionalDependencies)) {
        const peerDepsCount = Object.entries(contents.optionalDependencies).length;
        if (peerDepsCount > 0) {
            throw new Error(`There should not be any optionalDependencies in package.json at ${filepath}.`);
        }
    }
}

/**
 * Ensure the version of a dependency is an exact version number (not a semver range).
 */
function checkDependencyVersion({name, version, filepath}: {name: string; version: string; filepath: string}) {
    if (!/^\d/.test(version)) {
        throw new Error(`Dependency "${name}" must be an exact version, but found "${version}" in package.json at "${filepath}".`);
    }
}
