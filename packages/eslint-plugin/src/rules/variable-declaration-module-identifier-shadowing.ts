import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "variableDeclarationModuleIdentifierShadowing";

export const name = "variable-declaration-module-identifier-shadowing";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
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
            variableDeclarationModuleIdentifierShadowing: "Do not declare variables with identifiers `module`. This may breaks webpack hot reloading and react fast refresh.",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            VariableDeclarator(node) {
                if (node.id.type === AST_NODE_TYPES.Identifier && node.id.name === "module") {
                    context.report({
                        node: node.id,
                        messageId: "variableDeclarationModuleIdentifierShadowing",
                    });
                }
            },
        };
    },
});
