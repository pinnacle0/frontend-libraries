import fs from "fs";
import path from "path";

interface Fixture {
    path: string;
    data: string;
}

const tmpDirectory = path.join(__dirname, "./__tmp__/valid");
const tmpReduxStatePath = path.join(tmpDirectory, "type/state.ts");
const tmpCommonOldFeatureTypePath = path.join(tmpDirectory, "module/common/old-feature/type.ts");

const tmpOldStructureDirectory = path.join(__dirname, "./__tmp__/update-structure");
const tmpOldStructurePath = path.join(tmpOldStructureDirectory, "module/common/feature");

describe("ModuleGenerator class add", () => {
    afterAll(() => {
        // Comment the following line to see the add function files
        fs.rmSync(tmpDirectory, {recursive: true});
        // Comment the following line to see the update function files
        fs.rmSync(tmpOldStructureDirectory, {recursive: true});
    });

    test("generate files", async () => {
        const fixtures = getFixtures();

        setupFixtures(fixtures, tmpDirectory);

        fixtures.forEach(_ => expect(fs.existsSync(_.path)).toBe(true));

        jest.doMock("yargs", () => ({
            parseSync: () => ({_: {0: "common/new-feature"}}),
        }));
        jest.doMock("../../src/PrettierUtil", () => ({
            PrettierUtil: {format: () => {}},
        }));

        // Note: inline require ModuleGenerator after `jest.doMock` calls to ensure that require hooks are registered (without relying on ts-jest or babel-jest magic)
        const {ModuleGenerator} = jest.requireActual<typeof import("../../src/ModuleGenerator")>("../../src/ModuleGenerator");
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

    test("update module structure", async () => {
        const fixtures = getOldStructureFixtures();

        setupFixtures(fixtures, tmpOldStructureDirectory);

        fixtures.forEach(_ => expect(fs.existsSync(_.path)).toBe(true));

        jest.doMock("../../src/PrettierUtil", () => ({
            PrettierUtil: {format: () => {}},
        }));

        const {ModuleGenerator} = jest.requireActual<typeof import("../../src/ModuleGenerator")>("../../src/ModuleGenerator");
        await new ModuleGenerator.Web({
            srcDirectory: tmpOldStructureDirectory,
        }).update();

        const expectedFiles = [path.join(tmpOldStructurePath, "Main/index.tsx"), path.join(tmpOldStructurePath, "index.ts"), path.join(tmpOldStructurePath, "module.ts")];

        expectedFiles.forEach(path => {
            const exists = fs.existsSync(path) ? "exists" : "not-exists";
            expect(`${exists}: ${path}`).toBe(`exists: ${path}`);
        });

        expectedFiles.forEach(path => {
            expect(fs.readFileSync(path, {encoding: "utf8"})).toMatchSnapshot("Update Structure Snapshot");
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

function getOldStructureFixtures(): Fixture[] {
    return [
        {
            path: path.join(tmpOldStructurePath, "index.ts"),
            data: `
import { Main } from "./Main";
import type { SagaGenerator } from "core-fe";
import type { RootState } from "type/state";
import type { State } from "./type";

const initialState: State = {};

class FeatureModule extends Module<RootState, "feature"> {
    override *onEnter(): SagaGenerator {
        // TODO
    }
}
const featureModule = register(new FeatureModule("feature", initialState));
export const actions = featureModule.getActions();
export const MainComponent: React.ComponentType = featureModule.attachLifecycle(Main);`,
        },
        {
            path: path.join(tmpOldStructurePath, "Main", "index.tsx"),
            data: `import React from "react";
import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";
            export const Main = ReactUtil.memo("feature",() => {return <div/>});
`,
        },
        {
            path: path.join(tmpOldStructurePath, "hooks.ts"),
            data: `import { useSelector } from "core-fe";
import type { RootState } from "type/state";

export function useFeatureState<T>(fn: (state: RootState["app"]["feature"]) => T): T {
    return useSelector((state: RootState) => fn(state.app.feature));
}`,
        },
        {
            path: path.join(tmpOldStructurePath, "type.ts"),
            data: `export interface State {}
`,
        },
    ];
}
