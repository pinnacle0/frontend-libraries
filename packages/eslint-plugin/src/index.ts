import type {ESLint} from "eslint";
import {rules} from "./rules";
import {assignConfigs} from "./config";

const plugin: ESLint.Plugin = {
    configs: {},
    rules: rules as any,
    processors: {},
};

assignConfigs(plugin);

export default plugin;
