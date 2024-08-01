// @ts-ignore

import type {TSESTree} from "@typescript-eslint/utils";
import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/utils";

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

const defaultRestrictedImports = ["react", "react-dom"];

export const rule = ESLintUtils.RuleCreator(_ => name)<[string[]], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            noNamedImports: 'Named imports forbidden with package "{{name}}"',
        },
        schema: [
            {
                type: "array",
                items: {
                    type: "string",
                },
                uniqueItems: true,
            },
        ],
    },
    defaultOptions: [defaultRestrictedImports],
    create(context, [options]) {
        const blacklist = new Set(options);
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
