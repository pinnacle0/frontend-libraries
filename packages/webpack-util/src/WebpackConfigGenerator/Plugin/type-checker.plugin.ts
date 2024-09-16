import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";
import type {RspackPluginInstance} from "@rspack/core";
import type {TypeScriptWorkerOptions} from "fork-ts-checker-webpack-plugin/lib/typescript/type-script-worker-options";

interface Options {
    tsconfigFilePath: string;
}

/**
 * Process type checking in another process
 * Support project references.
 */
export function typeCheckerPlugin({tsconfigFilePath}: Options): RspackPluginInstance {
    const typescript: TypeScriptWorkerOptions = {
        build: false,
        mode: "readonly",
        configFile: tsconfigFilePath,
        configOverwrite: {
            references: [],
        },
        diagnosticOptions: {
            semantic: true,
            syntactic: true,
        },
    };

    return WebpackConfigSerializationUtil.serializablePlugin("ForkTsCheckerWebpackPlugin", ForkTsCheckerWebpackPlugin, {
        devServer: false,
        typescript,
    });
}
