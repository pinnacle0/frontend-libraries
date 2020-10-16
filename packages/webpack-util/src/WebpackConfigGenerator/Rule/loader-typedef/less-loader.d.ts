import webpack from "webpack";

declare interface LessOptions extends Record<string, unknown> {}

export declare interface LessLoader extends webpack.RuleSetLoader {
    loader: "less-loader";
    options?: {
        lessOptions?: LessOptions | Function;
        additionalData?: string | Function;
        sourceMap?: boolean;
        webpackImporter?: boolean;
    };
}
