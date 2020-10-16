import webpack from "webpack";

export declare interface UrlLoader<FallbackLoader extends string | webpack.RuleSetLoader = webpack.RuleSetLoader> extends webpack.RuleSetLoader {
    loader: "url-loader";
    options: {
        limit?: boolean | number | string;
        mimetype?: boolean | string;
        encoding?: boolean | "utf8" | "utf16le" | "latin1" | "base64" | "hex" | "ascii" | "binary" | "ucs2";
        generator?: (mimetype: any, encoding: any, content: any, resourcePath: any) => any;
        fallback?: FallbackLoader;
        esModule?: boolean;
    };
}
