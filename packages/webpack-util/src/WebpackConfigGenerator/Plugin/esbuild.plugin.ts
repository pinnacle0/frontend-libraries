import type webpack from "webpack";
import {ESBuildMinifyPlugin} from "esbuild-loader";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

export function esbuildMinimizer(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("ESBuildMinifyPlugin", ESBuildMinifyPlugin, {
        target: "es5",
        css: true,
        sourcemap: true,
    });
}
