import autoprefixer from "autoprefixer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type webpack from "webpack";

/**
 * Static factories to create `webpack.config#module.rules[].use` items for css/less files.
 */
export class StylesheetLoader {
    static cssLoader(importLoaders: number): webpack.RuleSetLoader {
        return {
            loader: require.resolve("css-loader"),
            options: {
                importLoaders,
            },
        };
    }

    static lessLoader(): webpack.RuleSetLoader {
        return {
            loader: require.resolve("less-loader"),
            options: {
                lessOptions: {
                    javascriptEnabled: true,
                },
            },
        };
    }

    static miniCssExtractPluginLoader(): webpack.RuleSetLoader {
        return {
            loader: require.resolve(MiniCssExtractPlugin.loader),
        };
    }

    static postcssLoader(): webpack.RuleSetLoader {
        return {
            loader: require.resolve("postcss-loader"),
            options: {
                postcssOptions: {
                    plugins: [autoprefixer],
                },
            },
        };
    }

    static styleLoader(): webpack.RuleSetLoader {
        return {
            loader: require.resolve("style-loader"),
        };
    }
}
