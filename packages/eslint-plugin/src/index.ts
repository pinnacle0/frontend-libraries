import {rules} from "./rules";
import {baseline, jest} from "./config";

const plugin = {
    configs: {},
    rules: rules as any,
    processors: {},
};

Object.assign(plugin.configs, {
    baseline: baseline(plugin),
    jest,
});

export default plugin;
