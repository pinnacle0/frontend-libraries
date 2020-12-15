import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
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
    return WebpackConfigSerializationUtil.serializablePlugin("TerserWebpackPlugin", TerserWebpackPlugin, {
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
