import {rules} from "./rules";
import {baseline, vitest} from "./config";

const plugin = {
    configs: {},
    rules: rules as any,
    processors: {},
};

Object.assign(plugin.configs, {
    baseline: baseline(plugin),
    vitest,
});

export default plugin;
