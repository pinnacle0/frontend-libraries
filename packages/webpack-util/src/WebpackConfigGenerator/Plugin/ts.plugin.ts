import TerserWebpackPlugin from "terser-webpack-plugin";
import type webpack from "webpack";
import {WebpackConfigGeneratorSerializableType} from "../../type";

interface TerserPluginOptions {
    sourceMap: boolean;
}

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function terserPlugin({sourceMap}: TerserPluginOptions): webpack.WebpackPluginInstance {
    const options: TerserWebpackPlugin.TerserPluginOptions = {
        terserOptions: {
            sourceMap,
        },
    };
    const plugin = new TerserWebpackPlugin(options);
    return Object.defineProperty(plugin, "toWebpackConfigGeneratorSerializableType", {
        value: (): WebpackConfigGeneratorSerializableType => ({
            "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
            pluginName: "TerserWebpackPlugin",
            pluginOptions: options,
        }),
    });
}
