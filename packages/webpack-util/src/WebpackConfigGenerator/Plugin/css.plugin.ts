import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type webpack from "webpack";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

interface ExtractCssPluginOptions {
    enableProfiling: boolean;
}

/**
 * Applies CssNano to minimize stylesheets
 * after bundles/chunks are built.
 */
export function cssMinimizerPlugin(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("CssMinimizerWebpackPlugin", CssMinimizerWebpackPlugin);
}

/**
 * Extract output of css transformation pipeline to standalone css files.
 * Must be used with `MiniCssExtractPlugin.loader`, which is included with
 * `Rule.stylesheet({minimize: true})`.
 */
export function miniCssExtractPlugin({enableProfiling}: ExtractCssPluginOptions): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("MiniCssExtractPlugin", MiniCssExtractPlugin, {
        filename: enableProfiling ? "static/css/[name].[contenthash:8].css" : "static/css/[contenthash:8].css",
        // order of css output depends on the order of imports in js,
        // unless all imports in js are sorted (e.g. by alphabetical order),
        // this flag must be set to true to avoid error
        ignoreOrder: true,
    });
}
