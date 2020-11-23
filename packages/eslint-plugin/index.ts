import {configBaseline} from "./src/config/baseline";
import {configJest} from "./src/config/jest";
import {allRules} from "./src/rules";

export const rules = allRules;

export const configs = {
    baseline: configBaseline,
    jest: configJest,
};
