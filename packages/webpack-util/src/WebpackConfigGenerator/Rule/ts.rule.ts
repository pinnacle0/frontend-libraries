import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    fastRefresh?: boolean;
    nonES5Module?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- temp disable
export function tsRule({fastRefresh = false, nonES5Module = []}: Deps): webpack.RuleSetRule {
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
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
                experimental: {
                    plugins: fastRefresh ? [[require.resolve("swc-plugin-core-fe-hmr"), {}]] : undefined,
                },
            },
        },
    };

    return {
        test: RegExpUtil.fileExtension(".js", ".mjs", ".cjs", ".ts", ".tsx"),
        use: [swcLoader],
        // exclude: fastRefresh ? /node_modules/ : RegExpUtil.webpackExclude({expect: nonES5Module}),
        exclude: fastRefresh ? /node_modules/ : () => false,
    };
}
