import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "unnecessaryEndingIndex";

export const name = "unnecessary-ending-index";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "No index at the end of import statements",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            unnecessaryEndingIndex: "unnecessary ending index",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ImportDeclaration(node): void {
                const importSourcePath = node.source.value?.toString();
                if (importSourcePath && importSourcePath.endsWith("/index") && !isAllowedImportIndexPath(importSourcePath)) {
                    context.report({
                        node,
                        messageId: "unnecessaryEndingIndex",
                        fix: fixer => fixer.replaceText(node.source, node.source.raw.replace(/\/index"/, '"')),
                    });
                }
            },
        };
    },
});

function isAllowedImportIndexPath(importSourcePath: string): boolean {
    return importSourcePath === "./index" || /^(\.\.\/)+index$/.test(importSourcePath);
}
