import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "uglyRelativePath";

export const name = "ugly-relative-path";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "No ugly relative path imports",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            uglyRelativePath: 'no ["."], [".."] imports',
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
                if (node.source.value?.toString().match(/^(\.\.?\/?)+$/)) {
                    context.report({
                        node,
                        messageId: "uglyRelativePath",
                    });
                }
            },
        };
    },
});
