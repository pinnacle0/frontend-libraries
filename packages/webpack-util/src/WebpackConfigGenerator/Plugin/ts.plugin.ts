import ReactRefreshRspackPlugin from "@rspack/plugin-react-refresh";
import type {RspackPluginInstance, SwcJsMinimizerRspackPluginOptions} from "@rspack/core";
import {SwcJsMinimizerRspackPlugin} from "@rspack/core";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil.js";

export function jsMinimizerPlugin(): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin<SwcJsMinimizerRspackPluginOptions>("SwcJsMinimizerRspackPlugin", SwcJsMinimizerRspackPlugin, {
        minimizerOptions: {
            // rspack use different default compress passes value https://github.com/web-infra-dev/rspack/blob/main/packages/rspack/src/builtin-plugin/SwcJsMinimizerPlugin.ts#L282
            compress: {
                passes: 0,
            },
            format: {
                comments: "some",
            },
            minify: true,
        },
    });
}

/**
 * Adds react fast refresh functionality.
 * Requires babel plugin "react-refresh/babel".
 * Should not be used in production.
 */
export function reactRefreshPlugin(inDirectCodeExclude: RegExp[]): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("ReactRefreshPlugin", ReactRefreshRspackPlugin, {
        exclude: [/node_modules/, ...inDirectCodeExclude],
    });
}
