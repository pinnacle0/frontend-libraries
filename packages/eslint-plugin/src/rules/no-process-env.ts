import {ESLintUtils, TSESTree} from "@typescript-eslint/utils";

export type MessageIds = "noProcessEnv";

export const name = "no-process-env";

// reference: https://github.com/mysticatea/eslint-plugin-node/blob/master/lib/rules/no-process-env.js
export const rule = ESLintUtils.RuleCreator(_ => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Disallow the use of process.env",
        },
        hasSuggestions: true,
        messages: {
            noProcessEnv: "Unexpected use of process.env",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            MemberExpression(node) {
                if (
                    node.object.type === TSESTree.AST_NODE_TYPES.Identifier &&
                    node.object.name === "process" &&
                    ((node.property.type === TSESTree.AST_NODE_TYPES.Identifier && node.property.name === "env") ||
                        (node.property.type === TSESTree.AST_NODE_TYPES.Literal && node.property.value === "env"))
                ) {
                    context.report({node, messageId: "noProcessEnv"});
                }
            },
        };
    },
});
