/**
 * Version format: <major>.<minor>.<patch>
 * Throws error if version format invalid.
 *
 * Attention:
 * Return "no-upgrade" if currentVersion is newer than latestVersion
 */
export type ComparisonResult = "major-upgrade" | "minor-upgrade" | "patch-upgrade" | "no-upgrade";

function compare(currentVersion: string, latestVersion: string): ComparisonResult {
    const regex = /^\d+\.\d+(\.\d+)?$/;
    if (!regex.test(currentVersion)) throw new Error(`[util] VersionComparator.compare: invalid currentVrsion ${currentVersion}`);
    if (!regex.test(latestVersion)) throw new Error(`[util] VersionComparator.compare: invalid latestVersion ${latestVersion}`);

    // Patch Version might be undefined
    const [currentMajor, currentMinor, currentPatch = 0] = currentVersion.split(".").map(Number) as [number, number, number?];
    const [latestMajor, latestMinor, latestPatch = 0] = latestVersion.split(".").map(Number) as [number, number, number?];

    if (currentMajor > latestMajor) {
        return "no-upgrade";
    } else if (currentMajor < latestMajor) {
        return "major-upgrade";
    }

    if (currentMinor > latestMinor) {
        return "no-upgrade";
    } else if (currentMinor < latestMinor) {
        return "minor-upgrade";
    }

    if (currentPatch < latestPatch) {
        return "patch-upgrade";
    }

    return "no-upgrade";
}

export const VersionComparator = Object.freeze({
    compare,
});
