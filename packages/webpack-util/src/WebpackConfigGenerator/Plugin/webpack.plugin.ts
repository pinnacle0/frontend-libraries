import webpack from "webpack";

interface WebpackProgressPluginOptions {
    enableProfiling: boolean;
}

/**
 * Provides hot module replacement. No config should be required.
 * 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️ Must not be used in production. 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️
 */
export function webpackHmrPlugin(): webpack.WebpackPluginInstance {
    return new webpack.HotModuleReplacementPlugin();
}

/**
 * Reports progress during compilation.
 * Basically the same behavior as running webpack-cli with:
 * `$ webpack --progress`
 */
export function webpackProgressPlugin({enableProfiling}: WebpackProgressPluginOptions): webpack.WebpackPluginInstance {
    return new webpack.ProgressPlugin({
        profile: enableProfiling,
    });
}
