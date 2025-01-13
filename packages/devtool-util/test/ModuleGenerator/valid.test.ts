import fs from "fs";
import path from "path";
import {describe, test, expect, afterAll, vi} from "vitest";

interface Fixture {
    path: string;
    data: string;
}

const tmpDirectory = path.join(import.meta.dirname, "./__tmp__/valid");
const tmpReduxStatePath = path.join(tmpDirectory, "type/state.ts");
const tmpCommonOldFeatureTypePath = path.join(tmpDirectory, "module/common/old-feature/type.ts");

describe("ModuleGenerator class add", () => {
    afterAll(() => {
        // Comment the following line to see the add function files
        fs.rmSync(tmpDirectory, {recursive: true});
    });

    test("generate files", async () => {
        const fixtures = getFixtures();

        setupFixtures(fixtures, tmpDirectory);

        fixtures.forEach(_ => expect(fs.existsSync(_.path)).toBe(true));

        vi.doMock("yargs", () => ({
            default: () => ({parseSync: () => ({_: {0: "common/new-feature"}})}),
        }));
        vi.doMock("../../src/BiomeUtil", () => ({
            BiomeUtil: {format: () => {}},
        }));

        // Note: inline require ModuleGenerator after `jest.doMock` calls to ensure that require hooks are registered (without relying on ts-jest or babel-jest magic)
        const {ModuleGenerator} = await vi.importActual<typeof import("../../src/ModuleGenerator/index.js")>("../../src/ModuleGenerator/index.js");
        await new ModuleGenerator.Web({
            srcDirectory: tmpDirectory,
        }).run();

        const expectedNewFiles = [
            path.join(tmpDirectory, "module/common/new-feature/Main/index.tsx"),
            path.join(tmpDirectory, "module/common/new-feature/hooks.ts"),
            path.join(tmpDirectory, "module/common/new-feature/index.ts"),
            path.join(tmpDirectory, "module/common/new-feature/type.ts"),
            path.join(tmpDirectory, "module/common/new-feature/module.ts"),
        ];
        // Check if each expected new file exists
        expectedNewFiles.forEach(path => {
            const exists = fs.existsSync(path) ? "exists" : "not-exists";
            expect(`${exists}: ${path}`).toBe(`exists: ${path}`);
        });
        // Create a snapshot for each new file
        expectedNewFiles.concat([tmpReduxStatePath, tmpCommonOldFeatureTypePath]).forEach(path => {
            expect(fs.readFileSync(path, {encoding: "utf8"})).toMatchSnapshot("Generate Files Snapshot");
        });
    });
});

function setupFixtures(fixtures: Fixture[], dir: string) {
    if (fs.existsSync(dir)) fs.rmSync(dir, {recursive: true});
    fixtures.forEach(_ => {
        const fixtureDirectory = path.dirname(_.path);
        if (!fs.existsSync(fixtureDirectory)) fs.mkdirSync(fixtureDirectory, {recursive: true});
        fs.writeFileSync(_.path, _.data, {encoding: "utf8"});
    });
}

function getFixtures(): Fixture[] {
    return [
        {
            path: tmpReduxStatePath,
            data: `import type { State } from "core-fe";
import type { State as OldFeatureState } from "./modules/common/old-feature";

export interface RootState extends State {
    app: {
        oldFeature: OldFeatureState;
    };
}
`,
        },
        {
            path: tmpCommonOldFeatureTypePath,
            data: `//
export interface State {}
`,
        },
    ];
}
