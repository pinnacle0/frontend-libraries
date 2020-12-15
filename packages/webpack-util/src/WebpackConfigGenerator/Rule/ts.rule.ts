import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    tsconfigFilepath: string;
    transpileOnly: boolean;
    withReactFastRefreshBabelPlugin: boolean;
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
export function tsRule({tsconfigFilepath, transpileOnly, withReactFastRefreshBabelPlugin}: Deps): webpack.RuleSetRule {
    const babelLoader: webpack.RuleSetUseItem = {
        loader: require.resolve("babel-loader"),
        options: {
            plugins: [require.resolve("react-refresh/babel")],
        },
    };

    const tsLoader: webpack.RuleSetUseItem = {
        loader: require.resolve("ts-loader"),
        options: {
            colors: false,
            configFile: tsconfigFilepath,
            compilerOptions: {
                module: "ESNext",
                target: "ES5",
                noEmit: false,
            },
            transpileOnly,
        },
    };

    return {
        test: RegExpUtil.fileExtension(".ts", ".tsx"),
        use: withReactFastRefreshBabelPlugin ? [babelLoader, tsLoader] : [tsLoader],
    };
}
