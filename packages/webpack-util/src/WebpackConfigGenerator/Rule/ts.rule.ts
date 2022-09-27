import path from "path";
import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    tsconfigFilepath: string;
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
export function tsRule({tsconfigFilepath, fastRefresh}: Deps): webpack.RuleSetRule {
    const babelLoader: webpack.RuleSetUseItem = {
        loader: require.resolve("babel-loader"),
        options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"].map(_ => require.resolve(_)),
            plugins: [
                [require.resolve("@babel/plugin-proposal-decorators"), {version: "legacy"}],
                require.resolve(path.join(__dirname, "./core-fe-hmr-babel-plugin")),
                require.resolve("react-refresh/babel"),
            ],
        },
    };

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
                    },
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
            },
        },
    };

    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: fastRefresh ? [babelLoader] : [swcLoader],
    };
}
