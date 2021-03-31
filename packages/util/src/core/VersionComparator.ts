/**
 * Version format: <major>.<minor>.<patch>
 * Throws error if version format invalid.
 *
 * Attention:
 * Return "no-upgrade" if currentVersion is newer than latestVersion
 */

export type ComparisonResult = "major-upgrade" | "minor-upgrade" | "patch-upgrade" | "no-upgrade";

function compare(currentVersion: string, latestVersion: string): ComparisonResult {
    const regex = /^\d+\.\d+\.\d+$/;
    if (!regex.test(currentVersion) || !regex.test(latestVersion)) {
        throw new Error("invalid version string");
    }

    const [currentMajor, currentMinor, currentPatch] = currentVersion.split(".").map(Number);
    const [latestMajor, latestMinor, latestPatch] = latestVersion.split(".").map(Number);

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
