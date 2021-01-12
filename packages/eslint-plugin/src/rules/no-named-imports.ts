import type {TSESTree} from "@typescript-eslint/experimental-utils";
import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "noNamedImports";

export const name = "no-named-imports";

/**
 * import React, {useState} from "react";
 * React: ImportDefaultSpecifier
 * {useState}: ImportSpecifier
 * @param node
 * @return true if import statement contains any ImportSpecifier
 */
const hasImportSpecifier = (node: TSESTree.ImportDeclaration) => {
    return node.specifiers.some(_ => _.type === AST_NODE_TYPES.ImportSpecifier);
};

export const rule = ESLintUtils.RuleCreator(name => name)<string[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            noNamedImports: 'use [import {{name}} from "{{name}}" directly, no named imports.]]',
        },
        schema: {
            type: "array",
            items: {
                type: "string",
            },
            uniqueItems: true,
        },
    },
    defaultOptions: [],
    create: context => {
        const blacklist = new Set(context.options);
        const reportedNodes = new Set();
        return {
            ImportDeclaration(node): void {
                const nodeSource = node.source.value?.toString();
                if (!reportedNodes.has(node) && nodeSource && blacklist.has(nodeSource) && hasImportSpecifier(node)) {
                    context.report({
                        node,
                        messageId: "noNamedImports",
                        data: {
                            name: nodeSource,
                        },
                    });
                    reportedNodes.add(node);
                }
            },
        };
    },
});
