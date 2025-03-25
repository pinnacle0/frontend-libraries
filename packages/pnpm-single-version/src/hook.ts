import type {Lockfile} from "@pnpm/lockfile-file";
import {checker} from "./checker/index.js";
import {parseOptions} from "./parser-option/parse-option.js";
import {findProjectRoot} from "./parser-option/find-project-root.js";
import {pnpmLogger} from "./util/pnpm-logger.js";
import {logInstallationInterruptedMessage} from "./checker/error-message.js";
import {logger} from "@pnpm/logger";

export const hook = async (lockfile: Lockfile) => {
    try {
        const logger = pnpmLogger;
        const projectRoot = await findProjectRoot();
        const options = await parseOptions(projectRoot);
        if (checker(lockfile, options, logger)) {
            logInstallationInterruptedMessage(logger);
            process.exit(1);
        }
        return lockfile;
    } catch (error) {
        error instanceof Error ? logger.error(error) : console.error("Unexpected error", error);
        process.exit(1);
    }
};
