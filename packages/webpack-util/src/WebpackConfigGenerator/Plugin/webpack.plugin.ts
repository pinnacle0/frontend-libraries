import webpack from "webpack";

interface WebpackProgressPluginOptions {
    enableProfiling: boolean;
}

/**
 * Provides hot module replacement. No config should be required.
 * 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️ Must not be used in production. 🙅🏼‍♀️ 🙅🏼‍♀️ 🙅🏼‍♀️
 */
export function webpackHmrPlugin(): webpack.WebpackPluginInstance {
    const plugin = new webpack.HotModuleReplacementPlugin();
    return Object.defineProperty(plugin, "toJSON", {
        value: () => ({
            type: "WebpackPluginConstructorCall",
            pluginName: "webpack.HotModuleReplacementPlugin",
            pluginOptions: undefined,
        }),
    });
}

/**
 * Reports progress during compilation.
 * Basically the same behavior as running webpack-cli with:
 * `$ webpack --progress`
 */
export function webpackProgressPlugin({enableProfiling}: WebpackProgressPluginOptions): webpack.WebpackPluginInstance {
    type ProgressPluginOptions = ConstructorParameters<typeof webpack.ProgressPlugin>[0];
    const options: ProgressPluginOptions = {
        profile: enableProfiling,
    };
    const plugin = new webpack.ProgressPlugin(options);
    return Object.defineProperty(plugin, "toJSON", {
        value: () => ({
            type: "WebpackPluginConstructorCall",
            pluginName: "webpack.ProgressPlugin",
            pluginOptions: options,
        }),
    });
}
