import type {ESLint} from "eslint";
import {rules} from "./rules";
import {assignConfigs} from "./config";

const plugin: ESLint.Plugin = {
    configs: {},
    rules: rules as any,
    processors: {},
};

export default assignConfigs(plugin);
