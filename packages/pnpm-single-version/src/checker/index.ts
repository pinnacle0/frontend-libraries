import {nameVerFromPkgSnapshot} from "@pnpm/lockfile-utils";
import {pipe} from "../util/pipe.js";
import {ArrayValueMapHelper} from "../util/array-value-map-Helper.js";
import {LockfilePackagesMissingError} from "../error.js";
import {globUtil} from "../util/glob-util.js";
import {createErrorMessage, logErrorMessage} from "./error-message.js";
import type {CheckerOptions, LoggerType, PackageInfo} from "../type.js";
import type {Lockfile, PackageSnapshots} from "@pnpm/lockfile-utils";

export const filterNonSingleVersionDependencies = (packageInfoMap: Map<string, PackageInfo[]>): Map<string, PackageInfo[]> => {
    const nonSingleVersionPackageInfo = new Map<string, PackageInfo[]>();

    for (const [path, snapshots] of packageInfoMap.entries()) {
        if (snapshots.length > 1) {
            nonSingleVersionPackageInfo.set(path, snapshots);
        }
    }

    return nonSingleVersionPackageInfo;
};

const filterSnapshotNeededForChecking =
    (snapshots: PackageSnapshots) =>
    (depsPattern: string[]): Map<string, PackageInfo[]> => {
        const matcher = globUtil.toRegex(depsPattern);
        const packageInfos = ArrayValueMapHelper.create<PackageInfo>();

        for (const [path, snapshot] of Object.entries(snapshots)) {
            console.info("path", path, "snapshot", snapshot);
            const nameVersionInfo: PackageInfo = nameVerFromPkgSnapshot(path, snapshot);
            if (matcher.test(nameVersionInfo.name)) {
                ArrayValueMapHelper.add(packageInfos, nameVersionInfo.name, nameVersionInfo);
            }
        }

        return packageInfos;
    };

export const checker = (lockfile: Lockfile, options: CheckerOptions, logger: LoggerType) => {
    if (!lockfile.packages) {
        throw new LockfilePackagesMissingError();
    }

    logger.message("Verify single version dependencies...");

    return pipe(filterSnapshotNeededForChecking(lockfile.packages), filterNonSingleVersionDependencies, createErrorMessage, logErrorMessage(logger))(options.includes);
};
