import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type webpack from "webpack";

interface ExtractCssPluginOptions {
    enableProfiling: boolean;
}

/**
 * Applies CssNano to minimize stylesheets
 * after bundles/chunks are built.
 */
export function cssMinimizerPlugin(): webpack.WebpackPluginInstance {
    const plugin = new CssMinimizerWebpackPlugin();
    return Object.defineProperty(plugin, "toWebpackConfigGeneratorSerializableType", {
        value: () => ({
            "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
            pluginName: `CssMinimizerWebpackPlugin`,
            pluginOptions: undefined,
        }),
    });
}

/**
 * Extract output of css transformation pipeline to standalone css files.
 * Must be used with `MiniCssExtractPlugin.loader`, which is included with
 * `Rule.stylesheet({minimize: true})`.
 */
export function miniCssExtractPlugin({enableProfiling}: ExtractCssPluginOptions): webpack.WebpackPluginInstance {
    const options: MiniCssExtractPlugin.PluginOptions = {
        // TODO: try [hash]
        filename: enableProfiling ? "static/css/[name].[contenthash:8].css" : "static/css/[contenthash:8].css",
        // order of css output depends on the order of imports in js,
        // unless all imports in js are sorted (e.g. by alphabetical order),
        // this flag must be set to true to avoid error
        ignoreOrder: true,
    };
    const plugin = new MiniCssExtractPlugin(options);
    return Object.defineProperty(plugin, "toWebpackConfigGeneratorSerializableType", {
        value: () => ({
            "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
            pluginName: `MiniCssExtractPlugin`,
            pluginOptions: options,
        }),
    });
}
