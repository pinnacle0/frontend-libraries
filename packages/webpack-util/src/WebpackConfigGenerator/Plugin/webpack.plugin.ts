import {ProgressPlugin, DefinePlugin} from "@rspack/core";
import type {RspackPluginInstance} from "@rspack/core";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

interface WebpackProgressPluginOptions {
    enableProfiling: boolean;
}

/**
 * Reports progress during compilation.
 * Basically the same behavior as running webpack-cli with:
 * `$ webpack --progress`
 */
export function webpackProgressPlugin({enableProfiling}: WebpackProgressPluginOptions): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("ProgressPlugin", ProgressPlugin, {
        profile: enableProfiling,
    });
}

export function webpackDefinePlugin(map: {[key: string]: string}): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("DefinePlugin", DefinePlugin, map);
}
