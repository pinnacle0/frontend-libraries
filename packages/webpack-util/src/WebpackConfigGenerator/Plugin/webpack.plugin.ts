import webpack from "webpack";

interface WebpackProgressPluginDeps {
    enableProfiling: boolean;
}

/**
 * Provides hot module replacement. No config should be required.
 * 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️ Must not be used in production. 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️
 */
export function webpackHmrPlugin() {
    return new webpack.HotModuleReplacementPlugin();
}

/**
 * Reports progress during compilation.
 * Basically the same behaviour as running webpack-cli with:
 * `$ webpack --progress`
 */
export function webpackProgressPlugin({enableProfiling}: WebpackProgressPluginDeps) {
    return new webpack.ProgressPlugin({
        profile: enableProfiling,
    });
}
