import {ESLintUtils} from "@typescript-eslint/utils";

export type MessageIds = "noDeepNestedRelativeImports";

export const name = "no-deep-nested-relative-imports";

export const rule = ESLintUtils.RuleCreator(_ => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "No deep nested relative imports",
        },
        hasSuggestions: true,
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
