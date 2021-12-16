import {ESLintUtils, AST_NODE_TYPES} from "@typescript-eslint/experimental-utils";

export type MessageIds = "noReactNodeType";

export const name = "no-react-node-type";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "No React.ReactNode type.",
            recommended: "error",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            noReactNodeType: "No React.ReactNode type.",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => ({
        TSQualifiedName(node): void {
            if (node.right.name === "ReactNode") {
                context.report({
                    node,
                    messageId: "noReactNodeType",
                });
            }
        },
        TSTypeReference(node): void {
            if (node.typeName.type === AST_NODE_TYPES.Identifier && node.typeName.name === "ReactNode") {
                context.report({
                    node,
                    messageId: "noReactNodeType",
                });
            }
        },
    }),
});
