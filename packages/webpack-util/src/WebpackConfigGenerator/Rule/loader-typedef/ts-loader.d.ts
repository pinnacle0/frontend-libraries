import webpack from "webpack";

export declare interface TsLoader extends webpack.RuleSetLoader {
    loader: "ts-loader";
    options?: Partial<import("ts-loader").Options>;
}
