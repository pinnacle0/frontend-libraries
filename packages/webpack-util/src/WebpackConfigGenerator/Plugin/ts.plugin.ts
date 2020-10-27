import TerserWebpackPlugin from "terser-webpack-plugin";
import type webpack from "webpack";

interface TerserPluginOptions {
    sourceMap: boolean;
}

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function terserPlugin({sourceMap}: TerserPluginOptions): webpack.WebpackPluginInstance {
    return new TerserWebpackPlugin({
        terserOptions: {
            sourceMap,
        },
    }) as any;
}
