import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsWebpackPlugin from "optimize-css-assets-webpack-plugin";
import StylelintWebpackPlugin from "stylelint-webpack-plugin";

interface StylelintPluginOptions {
    directory: string;
}

interface ExtractCssPluginOptions {
    enableProfiling: boolean;
}

/**
 * Check code style of .less stylesheets using stylelint.
 * 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️ Must not be included if there are not .less files present. 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️
 * Config file is resolved by stylelint internally.
 */
export function stylelintPlugin({directory}: StylelintPluginOptions) {
    return new StylelintWebpackPlugin({
        context: directory,
        // glob pattern of files must be relative to options.context
        files: "**/*.less",
    });
}

/**
 * Applies CssNano to minimize stylesheets
 * after bundles/chunks are built.
 */
export function optimizeCSSAssetsPlugin() {
    return new OptimizeCSSAssetsWebpackPlugin();
}

/**
 * Extract output of css transformation pipeline to standalone css files.
 * Must be used with `MiniCssExtractPlugin.loader`, which is included with
 * `Rule.stylesheet({minimize: true})`.
 */
export function miniCssExtractPlugin({enableProfiling}: ExtractCssPluginOptions) {
    return new MiniCssExtractPlugin({
        filename: enableProfiling ? "static/css/[name].[contenthash:8].css" : "static/css/[contenthash:8].css",
        // order of css output depends on the order of imports in js,
        // unless all imports in js are sorted (e.g. by alphabetical order),
        // this flag must be set to true to avoid error
        ignoreOrder: true,
    });
}
