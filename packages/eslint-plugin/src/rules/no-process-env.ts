import {ESLintUtils} from "@typescript-eslint/experimental-utils";
import {TSESTree} from "@typescript-eslint/experimental-utils";

export type MessageIds = "noProcessEnv";

export const name = "no-process-env";

// reference: https://github.com/mysticatea/eslint-plugin-node/blob/master/lib/rules/no-process-env.js
export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Disallow the use of process.env",
            recommended: "error",
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
                    node.property.type === TSESTree.AST_NODE_TYPES.Identifier &&
                    node.object.name === "process" &&
                    node.property.name === "env"
                ) {
                    context.report({node, messageId: "noProcessEnv"});
                }
            },
        };
    },
});
