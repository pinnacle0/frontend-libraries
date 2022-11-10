import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    fastRefresh: boolean;
}

/**
 * Handles dependency requests to typescript files
 * by compiling with `tsc`.
 *
 * To enable react fast refresh, set `withReactFastRefreshBabelPlugin` to true,
 * this requires "@pmmmwh/react-refresh-webpack-plugin" webpack plugin to work,
 * and should not be used in production.
 *
 * @see https://github.com/TypeStrong/ts-loader
 * @see https://github.com/pmmmwh/react-refresh-webpack-plugin
 */
export function tsRule({fastRefresh}: Deps): webpack.RuleSetRule {
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
                    plugins: [[require.resolve("swc-plugin-core-fe-hmr"), {}]],
                },
            },
        },
    };

    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: [swcLoader],
    };
}
