import fs from "fs/promises";
import path from "path";
import {TextDecoder} from "util";
import {PACKAGE_JSON_OPTIONS_KEY} from "../constant.js";
import {OptionNotFoundError, OptionSyntaxError} from "../error.js";
import type {CheckerOptions} from "../type.js";

const validateOptions = (options: any): CheckerOptions => {
    if (!options || typeof options !== "object") {
        throw new OptionNotFoundError();
    }

    const o = options as Partial<CheckerOptions>;

    if (!Array.isArray(o?.includes)) {
        throw new OptionSyntaxError("Please make sure you have included single version dependencies in option.");
    }

    if (o?.failOnCI !== undefined && typeof o.failOnCI !== "boolean") {
        throw new OptionSyntaxError("Please use boolean for failedOnCI option");
    }

    return options as CheckerOptions;
};

export const parseOptions = async (projectRoot: string): Promise<CheckerOptions> => {
    const packageJsonfile = await fs.readFile(path.join(projectRoot, "package.json"));
    // @see https://github.dev/sindresorhus/load-json-file
    const packageJSON = JSON.parse(new TextDecoder().decode(packageJsonfile));

    const options = validateOptions((packageJSON as any)?.[PACKAGE_JSON_OPTIONS_KEY]);

    if (options.failOnCI === undefined) {
        options.failOnCI = true;
    }

    return options;
};
