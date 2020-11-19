import type webpack from "webpack";
import {Constant} from "../../Constant";
import {RegExpUtil} from "./RegExpUtil";

/**
 * Handles dependency requests to file assets
 * by emitting as separate files.
 *
 * @see https://webpack.js.org/loaders/file-loader/
 */
export function otherRule(): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".ico", ...Constant.mediaExtensions, ...Constant.fontExtensions),
        use: [
            {
                loader: require.resolve("file-loader"),
                options: {
                    name: "static/other/[name].[hash:8].[ext]",
                    esModule: false,
                },
            },
        ],
    };
}
