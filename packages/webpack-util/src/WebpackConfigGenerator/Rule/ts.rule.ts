import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    tsconfigFilepath: string;
}

/**
 * Handles dependency requests to typescript files
 * by compiling with `tsc`.
 *
 * @see https://github.com/TypeStrong/ts-loader
 */
export function tsRule({tsconfigFilepath}: Deps): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: [
            {
                loader: require.resolve("ts-loader"),
                options: {
                    configFile: tsconfigFilepath,
                },
            },
        ],
    };
}
