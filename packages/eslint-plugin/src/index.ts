import {configBaseline} from "./config/baseline";
import {configJest} from "./config/jest";
import {allRules} from "./rules";

export = {
    rules: allRules,
    configs: {
        baseline: configBaseline,
        jest: configJest,
    },
};
