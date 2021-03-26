/**
 * Version format: <major>.<minor>.<patch>
 * Throws error if version format invalid.
 *
 * Attention:
 * Return "no-upgrade" if currentVersion is newer than latestVersion
 */

type ComparisonResult = "major-upgrade" | "minor-upgrade" | "patch-upgrade" | "no-upgrade";

function compare(currentVersion: string, latestVersion: string): ComparisonResult {
    // TODO: impl & test cases
    return "no-upgrade";
}

export const VersionComparator = Object.freeze({
    compare,
});
