import webpack from "webpack";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

interface WebpackProgressPluginOptions {
    enableProfiling: boolean;
}

/**
 * Reports progress during compilation.
 * Basically the same behavior as running webpack-cli with:
 * `$ webpack --progress`
 */
export function webpackProgressPlugin({enableProfiling}: WebpackProgressPluginOptions): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("webpack.ProgressPlugin", webpack.ProgressPlugin, {
        profile: enableProfiling,
    });
}

export function webpackDefinePlugin(map: {[key: string]: string}): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("webpack.DefinePlugin", webpack.DefinePlugin, map);
}
