import {findWorkspaceDir} from "@pnpm/find-workspace-dir";
import {realpath} from "fs/promises";
import findUp from "find-up";
import {ProjectRootError} from "../error.js";
import path from "path";

/**
 * Can find the root path of the package and monorepo
 */
export const findProjectRoot = async (): Promise<string> => {
    let projectRoot = await findWorkspaceDir(process.cwd());
    if (!projectRoot) {
        const packageJSONPath = await findUp("package.json", {cwd: await realpath(process.cwd())});
        projectRoot = packageJSONPath ? path.parse(packageJSONPath).dir : undefined;
    }

    if (!projectRoot) {
        throw new ProjectRootError();
    }

    return projectRoot;
};
