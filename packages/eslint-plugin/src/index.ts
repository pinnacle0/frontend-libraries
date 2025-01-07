import {rules} from "./rules/index.js";
import {baseline, vitest} from "./config/index.js";
import type {TSESLint} from "@typescript-eslint/utils";

export default (() => {
    const plugin = {
        configs: {} as {
            baseline: TSESLint.FlatConfig.ConfigArray;
            vitest: TSESLint.FlatConfig.ConfigArray;
        },
        rules,
        processors: {},
    };
    Object.assign(plugin.configs, {
        baseline: baseline(plugin),
        vitest,
    });
    return plugin satisfies TSESLint.FlatConfig.Plugin;
})();
