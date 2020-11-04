import * as fs from "fs";
import * as path from "path";

const tmpDirectory = path.join(__dirname, "./__tmp__/valid");
const templatePath = path.join(__dirname, "./__tmp__/valid/module-template");
const moduleBasePath = path.join(__dirname, "./__tmp__/valid/modules");
const reduxStateTypePath = path.join(__dirname, "./__tmp__/valid/state.ts");

describe("ModuleGenerator class", () => {
    const fixtures = getFixtures();

    beforeAll(() => {
        fs.rmSync(tmpDirectory, {recursive: true, force: true});
        fixtures.forEach(_ => {
            const fixtureDirectory = path.dirname(_.path);
            if (!fs.existsSync(fixtureDirectory)) fs.mkdirSync(fixtureDirectory, {recursive: true});
            fs.writeFileSync(_.path, _.data, {encoding: "utf8"});
        });
    });

    afterAll(() => {
        // Comment the following line to see the temp files
        fs.rmSync(tmpDirectory, {recursive: true, force: true});
    });

    test("generate files", async () => {
        fixtures.forEach(_ => expect(fs.existsSync(_.path)).toBe(true));

        jest.doMock("yargs", () => ({
            argv: {_: {0: "common/new-feature"}},
        }));
        jest.doMock("../../src/PrettierUtil", () => ({
            PrettierUtil: {
                format: () => {},
            },
        }));

        const {ModuleGenerator} = jest.requireActual<typeof import("../../src/ModuleGenerator")>("../../src/ModuleGenerator");
        await new ModuleGenerator({
            moduleBasePath,
            reduxStateTypePath,
            templatePath,
        }).run();

        const expectedNewFiles = [
            path.join(moduleBasePath, "common/new-feature/component/Main.tsx"),
            path.join(moduleBasePath, "common/new-feature/hooks.ts"),
            path.join(moduleBasePath, "common/new-feature/index.ts"),
            path.join(moduleBasePath, "common/new-feature/type.ts"),
        ];
        // Check if each expected new file exists
        expectedNewFiles.forEach(path => {
            const exists = fs.existsSync(path) ? "exists" : "not-exists";
            expect(`${exists}: ${path}`).toBe(`exists: ${path}`);
        });
        // Create a snapshot for each new file
        expectedNewFiles.forEach(path => {
            expect(fs.readFileSync(path, {encoding: "utf8"})).toMatchSnapshot();
        });
    });
});

function getFixtures(): {path: string; data: string}[] {
    return [
        /* Template fixtures ------------------------------------------------ */
        {
            path: path.join(templatePath, "component/Main.tsx"),
            data: `// This file is generated from a template, but can be modified
import React from "react";

export const Main = () => {
    return <div />;
};
`,
        },
        {
            path: path.join(templatePath, "hooks.ts"),
            data: `// This file is generated from a template, but can be modified
import {RootState} from "app/type/state";
import {useSelector} from "react-redux";

export function use{1}<T>(fn: (state: RootState["app"]["{2}"]) => T): T {
    return useSelector((state: RootState) => fn(state.app.{2}));
}
`,
        },
        {
            path: path.join(templatePath, "index.ts"),
            data: `// This file is generated from a template, but can be modified
import {RootState} from "app/type/state";
import {Lifecycle, Module, register, SagaIterator} from "core-native";
import {Main} from "./component/Main";
import {State} from "./type";

class {1} extends Module<RootState, "{2}"> {}

const module = register(new {1}("{2}"), initialState);
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
`,
        },
        {
            path: path.join(templatePath, "type.ts"),
            data: `// This file is generated from a template, but can be modified
export interface State {}
`,
        },

        /* Source fixtures -------------------------------------------------- */
        {
            path: reduxStateTypePath,
            data: `//
import {State as OldFeatureState} from "./modules/common/old-feature";
import {State} from "core-fe";

export interface RootState extends State {
    app: {
        oldFeature: OldFeatureState;
    };
}
`,
        },
        {
            path: path.join(moduleBasePath, "common/old-feature/types.ts"),
            data: `//
export interface State {}
`,
        },
    ];
}
