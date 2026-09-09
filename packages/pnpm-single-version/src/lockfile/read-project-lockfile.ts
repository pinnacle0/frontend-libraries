import {readFile} from "node:fs/promises";
import path from "node:path";
import {loadAll} from "js-yaml";
import type {Lockfile, PackageSnapshot} from "@pnpm/lockfile-utils";

const WANTED_LOCKFILE = "pnpm-lock.yaml";

/**
 * Read the project lockfile document from `pnpm-lock.yaml`.
 *
 * pnpm 11+ may write two YAML documents: an env lockfile first, then the project lockfile.
 * Always take the last document. See https://pnpm.io/lockfile
 */
export async function readProjectLockfile(projectRoot: string): Promise<Lockfile | null> {
    const lockfilePath = path.join(projectRoot, WANTED_LOCKFILE);
    let raw: string;
    try {
        raw = await readFile(lockfilePath, "utf8");
    } catch (error) {
        if (isEnoent(error)) {
            return null;
        }
        throw error;
    }

    const documents = loadAll(raw.replace(/^\uFEFF/, ""));
    const last = documents.at(-1);
    return toLockfile(last);
}

function toLockfile(document: unknown): Lockfile | null {
    if (!isRecord(document)) {
        return null;
    }

    const snapshots = document.snapshots;
    if (!isRecord(snapshots)) {
        return document as unknown as Lockfile;
    }

    const pkgMeta = isRecord(document.packages) ? document.packages : {};
    const packages: Record<string, PackageSnapshot> = {};
    for (const [depPath, snapshot] of Object.entries(snapshots)) {
        if (!isRecord(snapshot)) {
            continue;
        }
        const meta = pkgMeta[stripPeerSuffix(depPath)];
        packages[depPath] = {
            ...(isRecord(meta) ? meta : {}),
            ...snapshot,
        } as unknown as PackageSnapshot;
    }

    return {
        ...document,
        packages,
    } as unknown as Lockfile;
}

function stripPeerSuffix(depPath: string): string {
    const index = depPath.indexOf("(");
    return index === -1 ? depPath : depPath.slice(0, index);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value != null && typeof value === "object" && !Array.isArray(value);
}

function isEnoent(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}
