import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";

interface TsMinimizerPluginDeps {
    sourceMap: boolean;
}

interface TsStyleCheckerPluginDeps {
    projectSrcDirectory: string;
    eslintConfigFilepath: string;
    tsconfigFilepath: string;
}

/**
 * Applies Terser to minimize javascript
 * after bundles/chunks are built.
 */
export function tsMinimizerPlugin({sourceMap}: TsMinimizerPluginDeps) {
    return new TerserPlugin({
        sourceMap,
    });
}

/**
 * Type checks ts files using TS compiler,
 * and lint ts files using eslint.
 */
export function tsStyleCheckerPlugin({tsconfigFilepath, projectSrcDirectory, eslintConfigFilepath}: TsStyleCheckerPluginDeps) {
    return new ForkTsCheckerPlugin({
        typescript: {
            configFile: tsconfigFilepath,
        },
        eslint: {
            files: path.join(projectSrcDirectory, "**/*.{ts,tsx}"),
            options: {
                extensions: ["ts", "tsx"],
                configFile: eslintConfigFilepath,
            },
        },
    });
}
