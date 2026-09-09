import fs from "fs";

function check(lockFile: string, packages: string[]) {
    const matcher = toMatcher(packages);
    const versionsByName = groupVersionsByName(readPackageKeys(lockFile));
    const violations = [...versionsByName].filter(([name, versions]) => versions.size > 1 && matcher.test(name)).sort(([a], [b]) => a.localeCompare(b));

    if (violations.length === 0) {
        console.info(`✅ Single version check passed on ${packages.length} dependency patterns.`);
    } else {
        console.error(`❌ Found ${violations.length} ${violations.length === 1 ? "dependency" : "dependencies"} with multiple versions in ${lockFile}:`);
        for (const [name, versions] of violations) {
            console.error(`    - ${name}: ${[...versions].sort().join(", ")}`);
        }

        process.exit(1);
    }
}

/**
 * Keys of the top-level `packages` block, e.g. `react@19.2.8` and `'@types/react@19.2.18'`.
 * Peer suffixes such as `(react@19.2.8)` only appear in the `snapshots` block, so these keys are plain `name@version`.
 */
function readPackageKeys(lockFile: string): string[] {
    const document = fs
        .readFileSync(lockFile, "utf8")
        .split(/^---[ \t]*$/m)
        .filter(_ => _.trim() !== "")
        .at(-1);
    if (!document) throw new Error(`Invalid lock file format`);

    const keys: string[] = [];
    let insidePackages = false;

    for (const line of document.split("\n")) {
        if (/^\S/.test(line)) {
            insidePackages = line.startsWith("packages:");
            continue;
        }
        if (!insidePackages) continue;

        const matched = line.match(/^ {2}(?:'([^']+)'|([^\s'][^:]*)):/);
        if (matched) {
            keys.push(matched[1] ?? matched[2]);
        }
    }

    if (keys.length === 0) throw new Error(`No package found in ${lockFile}, run \`pnpm install\` first`);

    return keys;
}

function groupVersionsByName(keys: string[]): Map<string, Set<string>> {
    const versionsByName = new Map<string, Set<string>>();

    for (const key of keys) {
        const separatorIndex = key.lastIndexOf("@");
        if (separatorIndex <= 0) continue;

        const name = key.slice(0, separatorIndex);
        const versions = versionsByName.get(name) ?? new Set<string>();
        versions.add(key.slice(separatorIndex + 1));
        versionsByName.set(name, versions);
    }

    return versionsByName;
}

function toMatcher(patterns: string[]): RegExp {
    const sources = patterns.map(_ => _.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*"));
    return new RegExp(`^(?:${sources.join("|")})$`);
}

export const PnpmSingleVersionChecker = Object.freeze({
    check,
});
