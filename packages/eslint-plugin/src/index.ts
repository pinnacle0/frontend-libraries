import {rules} from "./rules/index.js";
import {baseline, vitest} from "./config/index.js";
import type {Config} from "eslint/config";
import type {ESLint} from "eslint";

const plugin = (() => {
    const p = {
        configs: {} as {
            baseline: Config[];
            vitest: Config[];
        },
        rules: rules as unknown as ESLint.Plugin["rules"],
        processors: {},
    };
    Object.assign(p.configs, {
        baseline: baseline(p),
        vitest,
    });
    return p;
})() satisfies ESLint.Plugin;

export default plugin;
