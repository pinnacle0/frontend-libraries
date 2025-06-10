import rspack from "@rspack/core";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil.js";
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
            include: {
                nesting: true,
                notSelectorList: true,
                dirSelector: true,
                langSelectorList: true,
                isSelector: true,
                textDecorationThicknessPercent: true,
                mediaIntervalSyntax: true,
                mediaRangeSyntax: true,
                customMediaQueries: true,
                clampFunction: true,
                colorFunction: true,
                oklabColors: true,
                labColors: true,
                p3Colors: true,
                hexAlphaColors: true,
                spaceSeparatedColorNotation: true,
                fontFamilySystemUi: true,
                doublePositionGradients: true,
                vendorPrefixes: true,
                logicalProperties: true,
                selectors: true,
                mediaQueries: true,
                color: true,
            },
        },
    });
}

/**
 * Extract output of css transformation pipeline to standalone css files.
 * Must be used with `MiniCssExtractPlugin.loader`, which is included with
 * `Rule.stylesheet({minimize: true})`.
 */
export function cssExtractPlugin({enableProfiling}: ExtractCssPluginOptions): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("CssExtractPlugin", rspack.CssExtractRspackPlugin, {
        filename: enableProfiling ? "static/css/[name].[contenthash:8].css" : "static/css/[contenthash:8].css",
        // order of css output depends on the order of imports in js,
        // unless all imports in js are sorted (e.g. by alphabetical order),
        // this flag must be set to true to avoid error
        ignoreOrder: true,
    });
}
