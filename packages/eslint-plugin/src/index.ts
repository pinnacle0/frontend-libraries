import {configBaseline} from "./config/baseline";
import {configJest} from "./config/jest";
import {allRules} from "./rules";

export const rules = allRules;

export const configs = {
    baseline: configBaseline,
    jest: configJest,
};
