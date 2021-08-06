import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "noDeepNestedRelativeImports";

export const name = "no-deep-nested-relative-imports";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "No deep nested relative imports",
            category: "Best Practices",
            recommended: "error",
        },
        messages: {
            noDeepNestedRelativeImports: 'no ["../../../"] imports',
        },
        schema: [
            {
                type: "object",
                additionalProperties: false,
            },
        ],
    },
    defaultOptions: [],
    create: context => {
        return {
            ImportDeclaration(node): void {
                if (node.source.value?.toString().startsWith("../../../")) {
                    context.report({
                        node,
                        messageId: "noDeepNestedRelativeImports",
                    });
                }
            },
        };
    },
});
