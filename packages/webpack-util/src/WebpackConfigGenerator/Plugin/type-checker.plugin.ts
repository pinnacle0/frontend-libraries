import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";
import type webpack from "webpack";

interface Options {
    tsconfigFilePath: string;
}

/**
 * Process type checking in another process
 * Support project references.
 */
export function typeCheckerPlugin({tsconfigFilePath}: Options): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("TerserWebpackPlugin", ForkTsCheckerWebpackPlugin, {
        devServer: false,
        typescript: {build: true, mode: "readonly", configFile: tsconfigFilePath},
    });
}
