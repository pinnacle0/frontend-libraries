import webpack from "webpack";

export declare interface StyleLoader extends webpack.RuleSetLoader {
    loader: "style-loader";
    options?: {
        injectType?: "styleTag" | "singletonStyleTag" | "lazyStyleTag" | "lazySingletonStyleTag" | "linkTag";
        attributes?: object;
        insert?: string | Function;
        base?: number;
        esModule?: boolean;
    };
}
