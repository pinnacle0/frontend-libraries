import type webpack from "webpack";
import {Utility} from "../Utility";
import type {FileLoader} from "./loader-typedef/file-loader";
import type {UrlLoader} from "./loader-typedef/url-loader";

export function imageRule(): webpack.RuleSetRule {
    const urlLoader: UrlLoader<FileLoader> = {
        loader: "url-loader",
        options: {
            limit: 1024,
            esModule: false,
            fallback: {
                loader: "file-loader",
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
