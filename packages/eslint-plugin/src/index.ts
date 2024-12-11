import {rules} from "./rules";
import {baseline, vitest} from "./config";
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
