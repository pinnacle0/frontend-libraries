import ReactRefreshRspackPlugin from "@rspack/plugin-react-refresh";
import {SwcJsMinimizerRspackPlugin} from "@rspack/core";
import type {RspackPluginInstance, SwcJsMinimizerRspackPluginOptions} from "@rspack/core";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function jsMinimizerPlugin(): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin<SwcJsMinimizerRspackPluginOptions>("TerserWebpackPlugin", SwcJsMinimizerRspackPlugin, {
        test: /.(js|jsx)$/,
        minimizerOptions: {
            minify: true,
            mangle: true,
        },
    });
}

/**
 * Adds react fast refresh functionality.
 * Requires babel plugin "react-refresh/babel".
 * Should not be used in production.
 */
export function reactRefreshPlugin(): RspackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("ReactRefreshPlugin", ReactRefreshRspackPlugin, {
        exclude: [/node_modules/],
    });
}
