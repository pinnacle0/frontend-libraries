import autoprefixer from "autoprefixer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type webpack from "webpack";
import type {CssLoader} from "./loader-typedef/css-loader";
import {LessLoader} from "./loader-typedef/less-loader";
import {PostcssLoader} from "./loader-typedef/postcss-loader";
import {StyleLoader} from "./loader-typedef/style-loader";

/**
 * Static factories to create `webpack.config#module.rules[].use` items for css/less files.
 */
export class StylesheetLoader {
    static readonly cssLoader = (importLoaders: number): CssLoader => ({
        loader: require.resolve("css-loader") as "css-loader",
        options: {
            importLoaders,
        },
    });

    static readonly lessLoader = (): LessLoader => ({
        loader: require.resolve("less-loader") as "less-loader",
        options: {
            lessOptions: {
                javascriptEnabled: true,
            },
        },
    });

    static readonly miniCssExtractPluginLoader = (): webpack.RuleSetLoader => ({
        loader: require.resolve(MiniCssExtractPlugin.loader),
    });

    static readonly postcssLoader = (): PostcssLoader => ({
        loader: require.resolve("postcss-loader") as "postcss-loader",
        options: {
            postcssOptions: {
                plugins: [autoprefixer],
            },
        },
    });

    static readonly styleLoader = (): StyleLoader => ({
        loader: require.resolve("style-loader") as "style-loader",
    });
}
