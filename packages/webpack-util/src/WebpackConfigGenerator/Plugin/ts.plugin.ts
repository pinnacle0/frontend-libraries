import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import TerserWebpackPlugin from "terser-webpack-plugin";

interface TerserPluginOptions {
    sourceMap: boolean;
}

interface ForkTsCheckerPluginOptions {
    projectSrcDirectory: string;
    tsconfigFilepath: string;
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

/**
 * Type checks ts files using TS compiler,
 * and lint ts files using eslint.
 */
export function forkTsCheckerPlugin({tsconfigFilepath, projectSrcDirectory}: ForkTsCheckerPluginOptions) {
    return new ForkTsCheckerWebpackPlugin({
        typescript: {
            configFile: tsconfigFilepath,
        },
        eslint: {
            files: path.join(projectSrcDirectory, "**/*.{ts,tsx}"),
            options: {
                extensions: ["ts", "tsx"],
            },
        },
    });
}
