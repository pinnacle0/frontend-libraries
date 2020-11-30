import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

/**
 * Handles dependency requests to image assets (".png", ".jpeg", ".jpg", ".gif")
 * by inlining as images as DataURL,
 * or emitting as separate files if file size is too large.
 *
 * @see https://webpack.js.org/loaders/url-loader/
 * @see https://webpack.js.org/loaders/file-loader/
 */
export function imageRule(): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".png", ".jpeg", ".jpg", ".gif", ".svg"),
        use: [
            {
                loader: require.resolve("url-loader"),
                options: {
                    limit: 1024,
                    esModule: false,
                    fallback: {
                        loader: require.resolve("file-loader"),
                        options: {
                            name: "static/img/[name].[hash:8].[ext]",
                            esModule: false,
                        },
                    },
                },
            },
        ],
    };
}
