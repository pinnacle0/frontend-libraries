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
