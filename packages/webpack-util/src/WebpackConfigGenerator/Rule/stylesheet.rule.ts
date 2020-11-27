import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type webpack from "webpack";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";
import {RegExpUtil} from "./RegExpUtil";

interface StylesheetRuleDeps {
    minimize: boolean;
}

function cssLoader(importLoaders: number): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("css-loader"),
        options: {
            importLoaders,
        },
    };
}

function lessLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("less-loader"),
        options: {
            lessOptions: {
                javascriptEnabled: true,
            },
        },
    };
}

function miniCssExtractPluginLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve(MiniCssExtractPlugin.loader),
    };
}

function postcssLoader(): webpack.RuleSetUseItem {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- Need to inject `toWebpackConfigGeneratorSerializableType` implementation
    const autoprefixer = WebpackConfigSerializationUtil.implementation(`require("autoprefixer")`, require("autoprefixer"));
    return {
        loader: require.resolve("postcss-loader"),
        options: {
            postcssOptions: {
                plugins: [autoprefixer],
            },
        },
    };
}

function styleLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("style-loader"),
    };
}

/**
 * Handles dependency requests to stylesheet assets (".css", ".less")
 * with `minimize: true` by `lessc` -> transform to js module -> inject to DOM as <style> tag,
 * or with `minimize: false` by `lessc` -> `autoprefixer` with `postcss` -> transform to js module -> extract to stylesheet
 *
 * @see https://webpack.js.org/loaders/css-loader/
 * @see https://webpack.js.org/loaders/less-loader/
 * @see https://webpack.js.org/plugins/mini-css-extract-plugin/
 * @see https://webpack.js.org/loaders/postcss-loader/
 * @see https://webpack.js.org/loaders/style-loader/
 */
export function stylesheetRule({minimize}: StylesheetRuleDeps): webpack.RuleSetRule {
    const use: webpack.RuleSetUseItem[] = minimize
        ? [
              miniCssExtractPluginLoader(),
              cssLoader(2),
              postcssLoader(),
              lessLoader(),
              // prettier-format-preserve
          ]
        : [
              styleLoader(),
              cssLoader(1),
              lessLoader(),
              // prettier-format-preserve
          ];

    return {
        test: RegExpUtil.fileExtension(".css", ".less"),
        use,
        // Declare all css/less imports as side effects (not to be considered
        // as dead code), regardless of the containing package claims to be
        // otherwise. This prevents css from being tree shaken.
        // Currently webpack does not add a warning / throw an error for this.
        // See: https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
    };
}
