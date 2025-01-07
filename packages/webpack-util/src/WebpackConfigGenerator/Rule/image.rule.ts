import type {RuleSetRule} from "@rspack/core";
import {RegExpUtil} from "./RegExpUtil.js";

/**
 * Handles dependency requests to image assets (".png", ".jpeg", ".jpg", ".gif", ".svg")
 * by inlining as images as DataURL,
 * or emitting as separate files if file size is too large.
 *
 * @see https://webpack.js.org/guides/asset-modules/
 */
export function imageRule(): RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".png", ".jpeg", ".jpg", ".gif", ".svg"),
        type: "asset",
        generator: {
            filename: "static/img/[name].[hash:8][ext][query]",
        },
        parser: {
            dataUrlCondition: {
                maxSize: 1024,
            },
        },
    };
}
