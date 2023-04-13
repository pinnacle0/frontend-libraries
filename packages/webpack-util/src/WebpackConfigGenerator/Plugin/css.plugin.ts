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
        minify: lightningCssMinifyWithPrettifyError,
        minimizerOptions: {
            targets: lightningcss.browserslistToTargets(browserslist("cover 99.5%")),
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

const lightningCssMinifyWithPrettifyError: BasicMinimizerImplementation<{targets: Targets}> = (...args) => {
    const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
    return CssMinimizerWebpackPlugin.lightningCssMinify(...args).catch((e: unknown) => {
        if (e instanceof Error) {
            const chalk = require("chalk");

            let message = e.message;

            if ("source" in e && "loc" in e) {
                const source = e.source as string;
                const loc = e.loc as {line: number; column: number};
                message += ` loc:[${loc.line}:${loc.column}]\n`;
                const lines = source
                    .split("\n")
                    .slice(Math.max(0, loc.line - 3), loc.line + 3)
                    .map((_, i) => `${chalk.greenBright(loc.line - 2 + i)}  \t${_}`);
                lines[2] = chalk.redBright.underline(lines[2]);
                message += lines.join("\n");
            }

            const prettierError = new Error();
            prettierError.name = e.name;
            prettierError.cause = e.cause;
            prettierError.message = message;
            throw prettierError;
        } else {
            throw e;
        }
    });
};
