import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import {browserslistToTargets} from "lightningcss";
import browserslist from "browserslist";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";
import type webpack from "webpack";
import type {Targets} from "lightningcss/node/targets";
import type {BasePluginOptions, DefinedDefaultMinimizerAndOptions} from "css-minimizer-webpack-plugin";

interface ExtractCssPluginOptions {
    enableProfiling: boolean;
}

new CssMinimizerWebpackPlugin({
    minify: CssMinimizerWebpackPlugin.lightningCssMinify,
});

/**
 * Applies CssNano to minimize stylesheets
 * after bundles/chunks are built.
 */
export function cssMinimizerPlugin(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin<BasePluginOptions & DefinedDefaultMinimizerAndOptions<{targets: Targets}>>("CssMinimizerWebpackPlugin", CssMinimizerWebpackPlugin, {
        parallel: true,
        minify: CssMinimizerWebpackPlugin.lightningCssMinify,
        minimizerOptions: {
            targets: browserslistToTargets(browserslist("cover 99.5%")),
        },
    });
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
