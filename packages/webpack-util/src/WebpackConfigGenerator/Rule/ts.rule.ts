import type {RuleSetRule, RuleSetUseItem} from "@rspack/core";
import {RegExpUtil} from "./RegExpUtil";

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
                        runtime: "classic",
                        refresh: fastRefresh,
                    },
                    decoratorVersion: "2022-03",
                },
                experimental: {
                    plugins: fastRefresh ? [[require.resolve("swc-plugin-core-fe-hmr"), {}]] : undefined,
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
