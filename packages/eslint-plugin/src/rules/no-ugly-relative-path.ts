import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "noUglyRelativePath";

export const name = "no-ugly-relative-path";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "No ugly relative path imports",
            recommended: "error",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            noUglyRelativePath: 'no ["."], [".."] imports',
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
                const importSource: string | undefined = node.source.value?.toString();
                if (!importSource) {
                    return;
                }
                if (importSource.match(/^(\.\.?\/?)+$/)) {
                    context.report({
                        node,
                        messageId: "noUglyRelativePath",
                        fix: [".", "..", "../.."].includes(importSource)
                            ? fixer => fixer.replaceTextRange(node.source.range, `"${importSource}/index"`)
                            : ["./", "../", "../../"].includes(importSource)
                              ? fixer => fixer.replaceTextRange(node.source.range, `"${importSource}index"`)
                              : null,
                    });
                }
            },
        };
    },
});
