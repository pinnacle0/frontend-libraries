import type webpack from "webpack";
import {Constant} from "../Constant";
import {Utility} from "../Utility";
import type {FileLoader} from "./loader-typedef/file-loader";

export function otherRule(): webpack.RuleSetRule {
    const fileLoader: FileLoader = {
        loader: "file-loader",
        options: {
            name: "static/other/[name].[hash:8].[ext]",
            esModule: false,
        },
    };

    return {
        test: Utility.regExpForFileExtension(".ico", ...Constant.mediaExtensions, ...Constant.fontExtensions),
        use: [fileLoader],
    };
}
