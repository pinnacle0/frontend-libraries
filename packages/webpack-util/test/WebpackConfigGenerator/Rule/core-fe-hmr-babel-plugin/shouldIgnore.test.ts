import * as babel from "@babel/core";
import plugin from "@pinnacle0/webpack-util/src/WebpackConfigGenerator/Rule/core-fe-hmr-babel-plugin";

describe("core-fe-hmr-babel-plugin", () => {
    test("should ignore when non core-fe source files", () => {
        const source = `
            import {Module} from "not-core-fe";
            import {Main} from "./component/Main";

            const initialState = {};
            class FeatureModule extends Module {}

            const featureModule = register(new FeatureModule("feature", initialState));
            export const actions = featureModule.getActions();
            export const MainComponent = featureModule.attachLifecycle(Main);
        `;
        const {code} = babel.transformSync(source, {plugins: [plugin]})!;
        expect(code).toMatchSnapshot();
        expect(code).not.toContain("if (module.hot) module.hot.decline();");
    });

    test("sanity test for some react component files", () => {
        const source = `
            import React from "react";
            import {ReactUtil} from "@pinnacle0/util";

            export const Main = ReactUtil.memo("Main", () => {
                return React.createElement("div", {});
            });
        `;
        const {code} = babel.transformSync(source, {plugins: [plugin]})!;

        expect(code).toMatchSnapshot();
        expect(code).not.toContain("if (module.hot) module.hot.decline();");
    });
});
