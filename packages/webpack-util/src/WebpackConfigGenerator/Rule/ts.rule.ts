import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    tsconfigFilepath: string;
    transpileOnly: boolean;
    experimentalWatchApi?: boolean;
}

/**
 * Handles dependency requests to typescript files
 * by compiling with `tsc`.
 *
 * @see https://github.com/TypeStrong/ts-loader
 */
export function tsRule({tsconfigFilepath, transpileOnly, experimentalWatchApi = false}: Deps): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: [
            {
                loader: require.resolve("ts-loader"),
                options: {
                    colors: false,
                    configFile: tsconfigFilepath,
                    compilerOptions: {
                        module: "esnext",
                        target: "es5",
                    },
                    transpileOnly,
                    experimentalWatchApi,
                },
            },
        ],
    };
}
