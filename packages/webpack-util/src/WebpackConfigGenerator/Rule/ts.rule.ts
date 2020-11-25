import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    /**
     * Enabling colors in ts-loader leaves may confusing glyphs in error messages
     * when the errors are not directly outputed to console.
     * (e.g. when collected with `stats.toJSON()` in `compiler.run()`)
     */
    enableColors: boolean;
    tsconfigFilepath: string;
}

/**
 * Handles dependency requests to typescript files
 * by compiling with `tsc`.
 *
 * @see https://github.com/TypeStrong/ts-loader
 */
export function tsRule({enableColors, tsconfigFilepath}: Deps): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: [
            {
                loader: require.resolve("ts-loader"),
                options: {
                    colors: enableColors,
                    configFile: tsconfigFilepath,
                    compilerOptions: {
                        module: "esnext",
                        target: "es5",
                    },
                },
            },
        ],
    };
}
