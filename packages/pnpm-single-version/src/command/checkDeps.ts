import {readWantedLockfile} from "@pnpm/lockfile-file";
import {Logger} from "../util/logger.js";
import isCI from "is-ci";
import {checker} from "../checker/index.js";
import {parseOptions} from "../parser-option/parse-option.js";
import {findProjectRoot} from "../parser-option/find-project-root.js";
import chalk from "chalk";
import {logInstallationInterruptedMessage} from "../checker/error-message.js";

export const checkDeps = async () => {
    try {
        const projectRoot = await findProjectRoot();
        const options = await parseOptions(projectRoot);
        const lockfile = await readWantedLockfile(projectRoot, {ignoreIncompatible: false});
        if (!lockfile) {
            Logger.message(`Cannot find ${chalk.blueBright("pnpm-lock.yaml")}, try to run ${chalk.blueBright("$ pnpm install")} first`);
            process.exit(1);
        }
        if (checker(lockfile, options, Logger) && options.failOnCI && isCI) {
            logInstallationInterruptedMessage(Logger);
            process.exit(1);
        }
    } catch (error) {
        error instanceof Error ? Logger.error(error) : console.error("Unexpected error", error);
        process.exit(1);
    }
};
