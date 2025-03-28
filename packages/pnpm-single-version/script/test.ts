import {findWorkspaceDir} from "@pnpm/find-workspace-dir";
import {realpath} from "fs/promises";
import findUp from "find-up";
import logger from "@pnpm/logger";

const run = async () => {
    const projectRoot =
        (await findWorkspaceDir(process.cwd())) ??
        findUp.sync(["package.json"], {
            cwd: await realpath(process.cwd()),
        });

    if (!projectRoot) {
        logger;
        return;
    }
};

run();
