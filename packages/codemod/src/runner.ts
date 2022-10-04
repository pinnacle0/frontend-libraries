const {run: jscodeshfit} = require("jscodeshift/src/Runner");

// @see https://github.com/facebook/jscodeshift#usage-cli
export interface JSCodeShiftOptions {
    dry?: boolean;
    transform?: string;
    print?: boolean;
    verbose?: 0 | 1 | 2;
    // parser?: "babel" | "ts" | "tsx";
}

type Stats = object;

export const runner = (transformPath: string, paths: string[], options: JSCodeShiftOptions): Promise<Stats> => {
    return jscodeshfit(transformPath, paths, options);
};
