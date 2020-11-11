import TerserWebpackPlugin from "terser-webpack-plugin";

interface TerserPluginOptions {
    sourceMap: boolean;
}

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function terserPlugin({sourceMap}: TerserPluginOptions) {
    return new TerserWebpackPlugin({
        sourceMap,
    });
}
