import {rspack} from "@rspack/core";
import {RegExpUtil} from "./RegExpUtil.js";
import {createRequire} from "node:module";
import type {RuleSetUseItem, RuleSetRule} from "@rspack/core";

interface StylesheetRuleDeps {
    minimize: boolean;
}

/**
 *
 * ref: https://rspack.dev/guide/features/loader#using-a-custom-loader
 * The loader file must be imported using CommonJS require()
 *
 */

function cssLoader(importLoaders: number): RuleSetUseItem {
    return {
        loader: createRequire(import.meta.url).resolve("css-loader"),
        options: {
            importLoaders,
        },
    };
}

function lessLoader(): RuleSetUseItem {
    return {
        loader: createRequire(import.meta.url).resolve("less-loader"),
        options: {
            lessOptions: {
                javascriptEnabled: true,
            },
        },
    };
}

function miniCssExtractPluginLoader(): RuleSetUseItem {
    return {
        loader: createRequire(import.meta.url).resolve(rspack.CssExtractRspackPlugin.loader),
    };
}

/**
 * Handles dependency requests to stylesheet assets (".css", ".less")
 * with `minimize: true` by `lessc` -> transform to js module -> inject to DOM as <style> tag,
 * or with `minimize: false` by `lessc` -> transform to js module -> extract to stylesheet
 *
 * @see https://webpack.js.org/loaders/css-loader/
 * @see https://webpack.js.org/loaders/less-loader/
 * @see https://webpack.js.org/plugins/mini-css-extract-plugin/
 * @see https://webpack.js.org/loaders/postcss-loader/
 * @see https://webpack.js.org/loaders/style-loader/
 */
export function stylesheetRule({minimize}: StylesheetRuleDeps): RuleSetRule {
    // Declare all css/less imports as side effects (not to be considered
    // as dead code), regardless of the containing package claims to be
    // otherwise. This prevents css from being tree shaken.
    // Currently webpack does not add a warning / throw an error for this.
    // See: https://github.com/webpack/webpack/issues/6571
    const sideEffects = true;
    const test = RegExpUtil.fileExtension(".css", ".less");

    if (minimize) {
        return {
            type: "javascript/auto",
            test,
            use: [miniCssExtractPluginLoader(), cssLoader(1), lessLoader()],
            sideEffects,
        };
    }

    // using rspack built-in css loader, experiments: { css: true }
    // ref: https://rspack.rs/guide/tech/css#built-in-css-support
    return {
        type: "css/auto",
        test,
        use: lessLoader(),
        sideEffects,
    };
}
