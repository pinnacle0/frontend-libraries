import autoprefixer from "autoprefixer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type webpack from "webpack";

const cssLoader = (importLoaders: number): webpack.RuleSetLoader => ({
    loader: "css-loader",
    options: {
        importLoaders,
    },
});

const lessLoader = (): webpack.RuleSetLoader => ({
    loader: "less-loader",
    options: {
        lessOptions: {
            javascriptEnabled: true,
        },
    },
});

const miniCssExtractPluginLoader = (): webpack.RuleSetLoader => ({
    loader: MiniCssExtractPlugin.loader,
});

const postcssLoader = (): webpack.RuleSetLoader => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: {
            plugins: [autoprefixer],
        },
    },
});

const styleLoader = (): webpack.RuleSetLoader => ({
    loader: "style-loader",
});

export const StylesheetLoader = Object.freeze({
    cssLoader,
    lessLoader,
    miniCssExtractPluginLoader,
    postcssLoader,
    styleLoader,
});
