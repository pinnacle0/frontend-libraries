import {parse as RecastParse, print} from "recast";
import {parse as BabelParse} from "@babel/parser";
import {builders, visit} from "ast-types";
import type {CreateToolkitOptions, Toolkit} from "./type";

export function createToolkit(options: CreateToolkitOptions = {}): Toolkit {
    return {
        parse: (source: string) =>
            RecastParse(source, {
                parser: {
                    parse: (source: string) =>
                        BabelParse(source, {
                            sourceType: "module",
                            tokens: true,
                            plugins: [
                                "jsx",
                                "typescript",
                                "decorators-legacy",
                                "asyncGenerators",
                                "bigInt",
                                "classPrivateMethods",
                                "classPrivateProperties",
                                "classProperties",
                                "classStaticBlock",
                                "decimal",
                                "doExpressions",
                                "dynamicImport",
                                "exportDefaultFrom",
                                "exportNamespaceFrom",
                                "functionBind",
                                "functionSent",
                                "importAssertions",
                                "importMeta",
                                "nullishCoalescingOperator",
                                "numericSeparator",
                                "objectRestSpread",
                                "optionalCatchBinding",
                                "optionalChaining",
                                "throwExpressions",
                                "topLevelAwait",
                                "v8intrinsic",
                            ],
                            ...(options?.parse ?? {}),
                        }),
                },
            }),
        builders,
        visit,
        generate: (ast: any) => print(ast, {wrapColumn: 200, ...(options?.generate ?? {})}),
    };
}
