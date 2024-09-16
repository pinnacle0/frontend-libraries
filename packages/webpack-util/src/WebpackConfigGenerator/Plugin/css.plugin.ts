import rspack from "@rspack/core";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";
import type {RspackPluginInstance} from "@rspack/core";

interface ExtractCssPluginOptions {
    enableProfiling: boolean;
}

/**
 * Applies CssNano to minimize stylesheets
 * after bundles/chunks are built.
 */
export function cssMinimizerPlugin(): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("CssMinimizerWebpackPlugin", rspack.LightningCssMinimizerRspackPlugin, {
        minimizerOptions: {
            targets: "cover 97.5%",
        },
    });
}

/**
 * Extract output of css transformation pipeline to standalone css files.
 * Must be used with `MiniCssExtractPlugin.loader`, which is included with
 * `Rule.stylesheet({minimize: true})`.
 */
export function miniCssExtractPlugin({enableProfiling}: ExtractCssPluginOptions): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("MiniCssExtractPlugin", rspack.CssExtractRspackPlugin, {
        filename: enableProfiling ? "static/css/[name].[contenthash:8].css" : "static/css/[contenthash:8].css",
        // order of css output depends on the order of imports in js,
        // unless all imports in js are sorted (e.g. by alphabetical order),
        // this flag must be set to true to avoid error
        ignoreOrder: true,
    });
}
