import * as babel from "@babel/core";
import plugin from "@pinnacle0/webpack-util/src/WebpackConfigGenerator/Rule/core-fe-hmr-babel-plugin";

describe("core-fe-hmr-babel-plugin", () => {
    test("works with `import {Module}`", () => {
        const source = `
            import {Module} from "core-fe";
            import {Main} from "./component/Main";

            const initialState = {};
            class FeatureModule extends Module {}

            const featureModule = register(new FeatureModule("feature", initialState));
            export const actions = featureModule.getActions();
            export const MainComponent = featureModule.attachLifecycle(Main);
        `;
        const {code} = babel.transform(source, {plugins: [plugin]});
        expect(code).toMatchSnapshot();
        expect(code).toContain("if (module.hot) module.hot.decline();");
    });

    test("works with `import {Module as CoreFEModule}`", () => {
        const source = `
            import {Module as CoreFEModule} from "core-fe";
            import {Main} from "./component/Main";

            const initialState = {};
            class FeatureModule extends CoreFEModule {}

            const featureModule = register(new FeatureModule("feature", initialState));
            export const actions = featureModule.getActions();
            export const MainComponent = featureModule.attachLifecycle(Main);
        `;
        const {code} = babel.transform(source, {plugins: [plugin]});
        expect(code).toMatchSnapshot();
        expect(code).toContain("if (module.hot) module.hot.decline();");
    });

    test("works with `import CoreFEDefault, {Module}`", () => {
        const source = `
            import CoreFEDefault, {Module} from "core-fe";
            import {Main} from "./component/Main";

            const initialState = {};
            class FeatureModule extends Module {}

            const featureModule = register(new FeatureModule("feature", initialState));
            export const actions = featureModule.getActions();
            export const MainComponent = featureModule.attachLifecycle(Main);
        `;
        const {code} = babel.transform(source, {plugins: [plugin]});
        expect(code).toMatchSnapshot();
        expect(code).toContain("if (module.hot) module.hot.decline();");
    });

    test("works with `import * as CoreFENamespace`", () => {
        const source = `
            import * as CoreFENamespace from "core-fe";
            import {Main} from "./component/Main";

            const initialState = {};
            class FeatureModule extends CoreFENamespace.Module {}

            const featureModule = register(new FeatureModule("feature", initialState));
            export const actions = featureModule.getActions();
            export const MainComponent = featureModule.attachLifecycle(Main);
        `;
        const {code} = babel.transform(source, {plugins: [plugin]});
        expect(code).toMatchSnapshot();
        expect(code).toContain("if (module.hot) module.hot.decline();");
    });
});
