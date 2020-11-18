import type webpack from "webpack";
import {Utility} from "../Utility";
import type {FileLoader} from "./loader-typedef/file-loader";
import type {UrlLoader} from "./loader-typedef/url-loader";

// TODO: ref xxxx URL
export function imageRule(): webpack.RuleSetRule {
    const urlLoader: UrlLoader<FileLoader> = {
        loader: require.resolve("url-loader") as "url-loader",
        options: {
            limit: 1024,
            esModule: false,
            fallback: {
                loader: require.resolve("file-loader") as "file-loader",
                options: {
                    name: "static/img/[name].[hash:8].[ext]",
                    esModule: false,
                },
            },
        },
    };

    return {
        test: Utility.regExpForFileExtension(".png", ".jpeg", ".jpg", ".gif"),
        use: [urlLoader],
    };
}
