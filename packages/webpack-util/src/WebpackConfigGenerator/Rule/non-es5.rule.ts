import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface Deps {
    nonES5Module: string[];
}

/**
 * Handles dependency inside node_modules
 * transpile all module list nonES5Module to ES5 code
 */
export function nonES5({nonES5Module}: Deps): webpack.RuleSetRule {
    const swcLoader: webpack.RuleSetUseItem = {
        loader: require.resolve("swc-loader"),
        options: {
            jsc: {
                target: "es5",
                parser: {
                    syntax: "typescript",
                    decorators: true,
                },
                transform: {
                    react: {
                        runtime: "classic",
                    },
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
            },
        },
    };

    return {
        test: RegExpUtil.fileExtension(".js", ".jsx"),
        use: [swcLoader],
        exclude: RegExpUtil.webpackNotExclude(nonES5Module),
    };
}
