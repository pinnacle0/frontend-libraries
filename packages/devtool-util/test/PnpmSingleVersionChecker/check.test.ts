import fs from "fs";
import path from "path";
import {PnpmSingleVersionChecker} from "../../src/PnpmSingleVersionChecker.js";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi} from "vitest";

const tmpDirectory = path.join(import.meta.dirname, "./__tmp__/check");
const lockFilePath = path.join(tmpDirectory, "pnpm-lock.yaml");

beforeAll(() => {
    if (fs.existsSync(tmpDirectory)) fs.rmSync(tmpDirectory, {recursive: true});
    fs.mkdirSync(tmpDirectory, {recursive: true});
});

afterAll(() => {
    if (fs.existsSync(tmpDirectory)) fs.rmSync(tmpDirectory, {recursive: true});
});

beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(process, "exit").mockImplementation((() => undefined) as unknown as typeof process.exit);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("PnpmSingleVersionChecker.check", () => {
    test("passes when matched packages each have a single version", () => {
        writeLockfile(createLockfile(["react@19.2.8", "react-dom@19.2.8", "@types/react@19.2.18"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["react", "react-dom", "@types/react"]);

        expectPass(3);
    });

    test("passes when unmatched packages have multiple versions", () => {
        writeLockfile(createLockfile(["react@18.3.1", "react@19.2.8", "lodash@4.17.21"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["lodash"]);

        expectPass(1);
    });

    test("passes when a wildcard matches several packages that each have a single version", () => {
        writeLockfile(createLockfile(["@ant-design/icons@6.3.2", "@ant-design/colors@8.0.1", "react@19.2.8"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["@ant-design/*"]);

        expectPass(1);
    });

    test("reports the number of patterns, not the number of packages in the lockfile", () => {
        writeLockfile(createLockfile(["react@19.2.8"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["react", "react-dom", "@types/react"]);

        expectPass(3);
    });

    test("exits when a matched package has multiple versions", () => {
        writeLockfile(createLockfile(["react@19.2.8", "react@18.3.1"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["react"]);

        expectFail([`❌ Found 1 dependency with multiple versions in ${lockFilePath}:`, "    - react: 18.3.1, 19.2.8"]);
    });

    test("uses plural wording when more than one dependency has multiple versions", () => {
        writeLockfile(createLockfile(["react@18.3.1", "react@19.2.8", "lodash@4.17.20", "lodash@4.17.21"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["react", "lodash"]);

        expectFail([`❌ Found 2 dependencies with multiple versions in ${lockFilePath}:`, "    - lodash: 4.17.20, 4.17.21", "    - react: 18.3.1, 19.2.8"]);
    });

    test("sorts violating package names and versions independently of lockfile order", () => {
        writeLockfile(createLockfile(["zod@4.0.0", "react@19.0.0", "zod@3.0.0", "react@18.0.0"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["react", "zod"]);

        expectFail([`❌ Found 2 dependencies with multiple versions in ${lockFilePath}:`, "    - react: 18.0.0, 19.0.0", "    - zod: 3.0.0, 4.0.0"]);
    });

    test("does not treat an exact name as a prefix of another package", () => {
        writeLockfile(createLockfile(["react@19.2.8", "react-dom@18.3.1", "react-dom@19.2.8"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["react"]);

        expectPass(1);
    });

    test("matches unscoped packages with a trailing wildcard", () => {
        writeLockfile(createLockfile(["eslint-plugin-import@2.32.0", "eslint-plugin-react@7.37.5", "eslint@10.8.1", "eslint@9.0.0"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["eslint-plugin-*"]);

        expectPass(1);
    });

    test("does not let * match a slash in scoped package names", () => {
        writeLockfile(createLockfile(["react@18.3.1", "react@19.2.8", "@types/react@18.3.1", "@types/react@19.2.18"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["*"]);

        expectFail([`❌ Found 1 dependency with multiple versions in ${lockFilePath}:`, "    - react: 18.3.1, 19.2.8"]);
    });

    test("matches scoped packages with a name wildcard", () => {
        writeLockfile(createLockfile(["@types/node@22.0.0", "@types/react@18.3.1", "@types/react@19.2.18"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["@types/*"]);

        expectFail([`❌ Found 1 dependency with multiple versions in ${lockFilePath}:`, "    - @types/react: 18.3.1, 19.2.18"]);
    });

    test("matches @ckeditor/* packages and ignores similarly named packages outside that scope", () => {
        writeLockfile(
            createLockfile([
                "@ckeditor/ckeditor5-core@41.4.0",
                "@ckeditor/ckeditor5-engine@41.4.0",
                "@ckeditor/ckeditor5-react@9.4.0",
                "@ckeditor/ckeditor5-react@9.5.0",
                "@ckeditor/typedoc-plugins@61.2.0",
                "@wiris/mathtype-ckeditor5@8.13.1",
                "@wiris/mathtype-ckeditor5@8.15.2",
                "eslint-plugin-ckeditor5-rules@19.0.0",
                "eslint-plugin-ckeditor5-rules@20.0.0",
            ])
        );

        PnpmSingleVersionChecker.check(lockFilePath, ["@ckeditor/*"]);

        expectFail([`❌ Found 1 dependency with multiple versions in ${lockFilePath}:`, "    - @ckeditor/ckeditor5-react: 9.4.0, 9.5.0"]);
    });

    test("passes when every @ckeditor/* package has a single version", () => {
        writeLockfile(createLockfile(["@ckeditor/ckeditor5-core@41.4.0", "@ckeditor/ckeditor5-react@9.5.0", "@ckeditor/typedoc-plugins@61.2.0", "react@18.3.1", "react@19.2.8"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["@ckeditor/*"]);

        expectPass(1);
    });

    test("treats distinct tarball URLs under @ckeditor/* as multiple versions", () => {
        writeLockfile(
            createLockfile([
                "@ckeditor/ckeditor5-mermaid@https://codeload.github.com/ckeditor/ckeditor5-mermaid/tar.gz/aaa",
                "@ckeditor/ckeditor5-mermaid@https://codeload.github.com/ckeditor/ckeditor5-mermaid/tar.gz/bbb",
            ])
        );

        PnpmSingleVersionChecker.check(lockFilePath, ["@ckeditor/*"]);

        expectFail([
            `❌ Found 1 dependency with multiple versions in ${lockFilePath}:`,
            "    - @ckeditor/ckeditor5-mermaid: https://codeload.github.com/ckeditor/ckeditor5-mermaid/tar.gz/aaa, https://codeload.github.com/ckeditor/ckeditor5-mermaid/tar.gz/bbb",
        ]);
    });

    test("treats regex metacharacters in patterns as literals", () => {
        writeLockfile(createLockfile(["lodash.isequal@4.5.0", "lodashXisequal@4.5.0", "lodashXisequal@4.6.0"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["lodash.isequal"]);

        expectPass(1);
    });

    test("reads quoted scoped keys and unquoted unscoped keys from the packages block", () => {
        writeLockfile(createLockfile(["react@19.2.8", "@types/react@19.2.18"]));

        PnpmSingleVersionChecker.check(lockFilePath, ["react", "@types/react"]);

        expectPass(2);
    });

    test("ignores the snapshots block, including peer-suffix keys", () => {
        writeLockfile(
            createLockfile(["react@19.2.8"], {
                snapshots: ["react@18.3.1", "react@19.2.8", "react@19.2.8(webpack@5.0.0)"],
            })
        );

        PnpmSingleVersionChecker.check(lockFilePath, ["react"]);

        expectPass(1);
    });

    test("uses the last YAML document when the lockfile contains multiple documents", () => {
        const staleDocument = createLockfile(["react@18.3.1", "react@19.2.8"]);
        const currentDocument = createLockfile(["react@19.2.8"]);
        writeLockfile(`---\n${staleDocument}---\n${currentDocument}`);

        PnpmSingleVersionChecker.check(lockFilePath, ["react"]);

        expectPass(1);
    });

    test("throws when the lockfile has no YAML document", () => {
        writeLockfile("---\n---\n");

        expect(() => PnpmSingleVersionChecker.check(lockFilePath, ["react"])).toThrow("Invalid lock file format");
        expect(process.exit).not.toHaveBeenCalled();
    });

    test("throws when the packages block is missing", () => {
        writeLockfile("lockfileVersion: '9.0'\n\nimporters:\n  .:\n    dependencies: {}\n");

        expect(() => PnpmSingleVersionChecker.check(lockFilePath, ["react"])).toThrow(`No package found in ${lockFilePath}, run \`pnpm install\` first`);
        expect(process.exit).not.toHaveBeenCalled();
    });

    test("throws when the packages block is empty", () => {
        writeLockfile("lockfileVersion: '9.0'\n\npackages:\n\nsnapshots:\n  react@19.2.8: {}\n");

        expect(() => PnpmSingleVersionChecker.check(lockFilePath, ["react"])).toThrow(`No package found in ${lockFilePath}, run \`pnpm install\` first`);
        expect(process.exit).not.toHaveBeenCalled();
    });

    test("does not parse nested mappings under importers as package keys", () => {
        writeLockfile(`lockfileVersion: '9.0'

importers:
  packages/web-ui:
    dependencies:
      react:
        specifier: 18.3.1
        version: 18.3.1

packages:
  react@19.2.8:
    resolution: {integrity: sha512-aaa}

snapshots:
  react@19.2.8: {}
`);

        PnpmSingleVersionChecker.check(lockFilePath, ["react"]);

        expectPass(1);
    });
});

function writeLockfile(content: string) {
    fs.writeFileSync(lockFilePath, content, {encoding: "utf8"});
}

function createLockfile(packageKeys: string[], options: {snapshots?: string[]} = {}): string {
    const packagesBlock = packageKeys.map(key => `  ${formatLockfileKey(key)}:\n    resolution: {integrity: sha512-test}`).join("\n");
    const snapshotKeys = options.snapshots ?? packageKeys;
    const snapshotsBlock = snapshotKeys.map(key => `  ${formatLockfileKey(key)}: {}`).join("\n");

    return `lockfileVersion: '9.0'

settings:
  autoInstallPeers: true

importers:
  .:
    dependencies:
      react:
        specifier: ^19.0.0
        version: 19.0.0

packages:
${packagesBlock}

snapshots:
${snapshotsBlock}
`;
}

function formatLockfileKey(key: string): string {
    return key.startsWith("@") || key.includes("/") ? `'${key}'` : key;
}

function expectPass(patternCount: number) {
    expect(process.exit).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(`✅ Single version check passed on ${patternCount} dependency patterns.`);
}

function expectFail(errorLines: string[]) {
    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.info).not.toHaveBeenCalled();
    expect(vi.mocked(console.error).mock.calls.map(([message]) => message)).toEqual(errorLines);
}
