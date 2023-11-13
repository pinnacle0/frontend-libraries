import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import lightningcss from "lightningcss";
import browserslist from "browserslist";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";
import type webpack from "webpack";
import type {Targets} from "lightningcss/node/targets";
import type {BasicMinimizerImplementation} from "css-minimizer-webpack-plugin";

interface ExtractCssPluginOptions {
    enableProfiling: boolean;
}

/**
 * Applies CssNano to minimize stylesheets
 * after bundles/chunks are built.
 */
export function cssMinimizerPlugin(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("CssMinimizerWebpackPlugin", CssMinimizerWebpackPlugin, {
        parallel: true,
        minify: lightningcssMinifyWithPrettifyError,
        minimizerOptions: {
            targets: lightningcss.browserslistToTargets(browserslist("cover 97.5%")),
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

/**
 * Add Vendor prefix and minify css with lightningcss.
 * Prettify error message to show the code snippet where the error occurs.
 */
const lightningcssMinifyWithPrettifyError: BasicMinimizerImplementation<{targets: Targets}> = (...args) => {
    const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
    return CssMinimizerWebpackPlugin.lightningCssMinify(...args);
};
