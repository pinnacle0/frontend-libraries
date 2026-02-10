import type {RuleSetRule, RuleSetUseItem} from "@rspack/core";
import {RegExpUtil} from "./RegExpUtil.js";
import {createRequire} from "node:module";

interface Deps {
    fastRefresh?: boolean;
}

export function tsRule({fastRefresh = false}: Deps = {}): RuleSetRule {
    const swcLoader: RuleSetUseItem = {
        loader: "builtin:swc-loader",
        options: {
            jsc: {
                target: "es5",
                parser: {
                    syntax: "typescript",
                    decorators: true,
                    tsx: true,
                },
                transform: {
                    react: {
                        development: fastRefresh,
                        // our ub project is using react-router-v5, which is not compatible with automatic runtime, so keep it classic
                        runtime: "classic",
                        refresh: fastRefresh,
                    },
                    decoratorVersion: "2022-03",
                },
                experimental: {
                    // The loader file must be imported using CommonJS require()
                    plugins: fastRefresh ? [[createRequire(import.meta.url).resolve("swc-plugin-core-fe-hmr"), {}]] : undefined,
                },
            },
        },
    };

    return {
        type: "javascript/auto",
        test: RegExpUtil.fileExtension(".js", ".mjs", ".cjs", ".ts", ".tsx"),
        use: [swcLoader],
        exclude: fastRefresh ? /node_modules/ : [],
    };
}
