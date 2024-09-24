import ReactRefreshRspackPlugin from "@rspack/plugin-react-refresh";
import TerserWebpackPlugin, {type TerserOptions, type DefinedDefaultMinimizerAndOptions} from "terser-webpack-plugin";
import type {RspackPluginInstance} from "@rspack/core";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

interface TerserPluginOptions {
    sourceMap: boolean;
}

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function terserPlugin({sourceMap}: TerserPluginOptions): RspackPluginInstance {
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
export function reactRefreshPlugin(inDirectCodeExclude: RegExp[]): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("ReactRefreshPlugin", ReactRefreshRspackPlugin, {
        exclude: [/node_modules/, ...inDirectCodeExclude],
    });
}
