import webpack from "webpack";

export declare interface FileLoader extends webpack.RuleSetLoader {
    loader: "file-loader";
    options: {
        name?: string | ((resourcePath: any, resourceQuery: any) => any);
        outputPath?: string | ((url: any, resourcePath: any, context: any) => any);
        publicPath?: string | ((url: any, resourcePath: any, context: any) => any);
        postTransformPublicPath?: (path: any) => any;
        context?: string;
        emitFile?: boolean;
        regExp?: RegExp;
        esModule?: boolean;
    };
}
