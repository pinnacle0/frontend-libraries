import {TsCheckerRspackPlugin} from "ts-checker-rspack-plugin";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil.js";
import type {RspackPluginInstance} from "@rspack/core";
import type {TypeScriptWorkerOptions} from "ts-checker-rspack-plugin/lib/typescript/type-script-worker-options.js";

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

    return WebpackConfigSerializationUtil.serializablePlugin("ForkTsCheckerWebpackPlugin", TsCheckerRspackPlugin, {
        devServer: false,
        typescript,
    });
}
