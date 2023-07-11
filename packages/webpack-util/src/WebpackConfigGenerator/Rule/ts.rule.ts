import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    fastRefresh?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- temp disable
export function tsRule({fastRefresh = false}: Deps = {}): webpack.RuleSetRule {
    const swcLoader: webpack.RuleSetUseItem = {
        loader: require.resolve("swc-loader"),
        options: {
            jsc: {
                target: "es5",
                parser: {
                    syntax: "typescript",
                    decorators: true,
                },
                transform: {
                    react: {
                        runtime: "classic",
                        refresh: fastRefresh,
                    },
                    decoratorVersion: "2022-03",
                },
            },
        },
    };

    return {
        test: RegExpUtil.fileExtension(".js", ".mjs", ".cjs", ".ts", ".tsx"),
        use: [swcLoader],
        exclude: fastRefresh ? /node_modules/ : [],
    };
}
