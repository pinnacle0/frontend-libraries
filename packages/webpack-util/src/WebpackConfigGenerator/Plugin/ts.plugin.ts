import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import type {TerserOptions, DefinedDefaultMinimizerAndOptions} from "terser-webpack-plugin";
import type webpack from "webpack";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

interface TerserPluginOptions {
    sourceMap: boolean;
}

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function terserPlugin({sourceMap}: TerserPluginOptions): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin<DefinedDefaultMinimizerAndOptions<TerserOptions>>("TerserWebpackPlugin", TerserWebpackPlugin, {
        minify: TerserWebpackPlugin.swcMinify,
        terserOptions: {
            sourceMap,
        },
    });
}

/**
 * Adds react fast refresh functionality.
 * Requires babel plugin "react-refresh/babel".
 * Should not be used in production.
 */
export function reactRefreshPlugin(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("ReactRefreshPlugin", ReactRefreshWebpackPlugin);
}

const ctorToFn =
    <A extends any[], R>(ctor: new (...args: A) => R) =>
    (...args: A) =>
        new ctor(...args);

class NamedPlugin<T> {
    constructor(public set: Array<T>) {}
}

const a = ctorToFn(NamedPlugin);

a<number>([123, 123]);
