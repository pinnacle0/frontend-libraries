import type webpack from "webpack";
import {ESBuildMinifyPlugin} from "esbuild-loader";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

/**
 * Minify CSS file using esbuild after transpile
 */
export function esbuildCssMinimizer(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("ESBuildMinifyPlugin", ESBuildMinifyPlugin, {
        // Disable Esbuild minify for JS. it is unstable when targeting es5 minify
        target: "es5",
        minify: false,
        css: true,
    });
}
