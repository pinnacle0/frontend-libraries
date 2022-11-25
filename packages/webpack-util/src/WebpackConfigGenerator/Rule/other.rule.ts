import type webpack from "webpack";
import {Constant} from "../../Constant";
import {RegExpUtil} from "./RegExpUtil";

interface OtherRuleDeps {
    extraExtensionsForOtherRule: string[];
}

/**
 * Handles dependency requests to file assets
 * by emitting as separate files.
 *
 * @see https://webpack.js.org/guides/asset-modules/
 */
export function otherRule({extraExtensionsForOtherRule}: OtherRuleDeps): webpack.RuleSetRule {
    return {
        // put `ico` here instead of image.rule, to avoid inline favicon into HTML
        test: RegExpUtil.fileExtension(".ico", ...Constant.mediaExtensions, ...Constant.fontExtensions, ...extraExtensionsForOtherRule),
        type: "asset/resource",
        generator: {
            filename: "static/other/[name].[hash:8][ext][query]",
        },
    };
}
