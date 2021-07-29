import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";
import svgToMiniDataURI from "mini-svg-data-uri";

/**
 * Handles dependency requests to SVG assets
 * by emitting as separate files.
 *
 * @see https://webpack.js.org/guides/asset-modules/
 */
export function svgRule(): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".svg"),
        type: "asset",
        generator: {
            filename: "static/img/[name][hash:8][ext][query]",
            dataUrl: (content: string) => {
                content = content.toString();
                return svgToMiniDataURI(content);
            },
        },
        parser: {
            dataUrlCondition: {
                maxSize: 1024,
            },
        },
    };
}
