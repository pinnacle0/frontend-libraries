import {mkdtemp, rm, writeFile} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {afterEach, describe, expect, test} from "vitest";
import {checker} from "../src/checker/index.js";
import {readProjectLockfile} from "../src/lockfile/read-project-lockfile.js";
import type {LoggerType} from "../src/type.js";

const SINGLE_DOCUMENT_LOCKFILE = `lockfileVersion: '9.0'

settings:
  autoInstallPeers: true

importers:
  .:
    dependencies:
      react:
        specifier: ^19.0.0
        version: 19.0.0

packages:
  react@18.3.1:
    resolution: {integrity: sha512-aaa}
  react@19.0.0:
    resolution: {integrity: sha512-bbb}

snapshots:
  react@18.3.1: {}
  react@19.0.0: {}
`;

const MULTI_DOCUMENT_LOCKFILE = `---
lockfileVersion: '9.0'

importers:
  .:
    configDependencies: {}
    packageManagerDependencies:
      pnpm:
        specifier: 12.3.4
        version: 12.3.4

packages:
  pnpm@12.3.4:
    resolution: {integrity: sha512-env}

snapshots:
  pnpm@12.3.4: {}
---
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true

importers:
  .:
    dependencies:
      react:
        specifier: ^19.0.0
        version: 19.0.0

packages:
  react@18.3.1:
    resolution: {integrity: sha512-aaa}
  react@19.0.0:
    resolution: {integrity: sha512-bbb}

snapshots:
  react@18.3.1: {}
  react@19.0.0: {}
`;

const dirs: string[] = [];

async function writeLockfile(content: string): Promise<string> {
    const dir = await mkdtemp(path.join(os.tmpdir(), "psv-lockfile-"));
    dirs.push(dir);
    await writeFile(path.join(dir, "pnpm-lock.yaml"), content);
    return dir;
}

function createLogger(): LoggerType & {messages: string[]} {
    const messages: string[] = [];
    return {
        messages,
        message: (value: string) => {
            messages.push(value);
        },
        error: (error: Error) => {
            messages.push(error.message);
        },
    };
}

afterEach(async () => {
    await Promise.all(dirs.splice(0).map(dir => rm(dir, {recursive: true, force: true})));
});

describe("readProjectLockfile", () => {
    test("returns null when pnpm-lock.yaml is missing", async () => {
        const dir = await mkdtemp(path.join(os.tmpdir(), "psv-lockfile-missing-"));
        dirs.push(dir);
        expect(await readProjectLockfile(dir)).toBeNull();
    });

    test("reads a single-document lockfile", async () => {
        const dir = await writeLockfile(SINGLE_DOCUMENT_LOCKFILE);
        const lockfile = await readProjectLockfile(dir);
        expect(lockfile?.packages).toMatchObject({
            "react@18.3.1": {resolution: {integrity: "sha512-aaa"}},
            "react@19.0.0": {resolution: {integrity: "sha512-bbb"}},
        });
        expect(lockfile?.packages).not.toHaveProperty("pnpm@12.3.4");
    });

    test("reads the last document of a multi-document lockfile", async () => {
        const dir = await writeLockfile(MULTI_DOCUMENT_LOCKFILE);
        const lockfile = await readProjectLockfile(dir);
        expect(lockfile?.packages).toMatchObject({
            "react@18.3.1": {resolution: {integrity: "sha512-aaa"}},
            "react@19.0.0": {resolution: {integrity: "sha512-bbb"}},
        });
        expect(lockfile?.packages).not.toHaveProperty("pnpm@12.3.4");
    });
});

describe("checker with multi-document lockfile", () => {
    test("checks project packages and ignores the env document", async () => {
        const dir = await writeLockfile(MULTI_DOCUMENT_LOCKFILE);
        const lockfile = await readProjectLockfile(dir);
        expect(lockfile).not.toBeNull();

        const reactLogger = createLogger();
        expect(checker(lockfile!, {includes: ["react"]}, reactLogger)).toBe(true);
        expect(reactLogger.messages.join("\n")).toContain("react");
        expect(reactLogger.messages.join("\n")).toContain("18.3.1");
        expect(reactLogger.messages.join("\n")).toContain("19.0.0");

        const pnpmLogger = createLogger();
        expect(checker(lockfile!, {includes: ["pnpm"]}, pnpmLogger)).toBe(false);
        expect(pnpmLogger.messages.join("\n")).toContain("All Passed");
    });
});
