import {Plugin} from "postcss";
import webpack from "webpack";

declare type PostcssConfigPluginItem = string | [string, object] | Plugin<any> | ReturnType<Plugin<any>>;

declare interface PostcssConfig extends Record<string, unknown> {
    plugins: PostcssConfigPluginItem[] | (() => PostcssConfigPluginItem[]);
}

export declare interface PostcssLoader extends webpack.RuleSetLoader {
    loader: "postcss-loader";
    options?: {
        execute?: boolean;
        postcssOptions?: {config: boolean | string} | PostcssConfig | ((..._: any) => any);
        sourceMap?: boolean;
    };
}
