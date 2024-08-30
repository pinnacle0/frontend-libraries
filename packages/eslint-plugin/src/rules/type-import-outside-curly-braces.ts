import {ESLintUtils} from "@typescript-eslint/utils";
import {TSESLint, TSESTree} from "@typescript-eslint/utils";

export type MessageIds = "typeImportOutsideBracket";

export const name = "type-import-outside-curly-braces";

export const rule = ESLintUtils.RuleCreator(_ => name)<[], MessageIds>({
    name,
    meta: {
        type: "problem",
        docs: {
            description: "the `type` keyword in type import should be written outside curly braces to avoid import statement still exist after erased",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            typeImportOutsideBracket: "the `type` keyword in `{{ currentNode }}` should be placed outside curly braces",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ImportDeclaration(node) {
                checkIsStandaloneTypeImport(context, node);
            },
        };
    },
});

function checkIsStandaloneTypeImport(context: Readonly<TSESLint.RuleContext<MessageIds, any>>, node: TSESTree.ImportDeclaration) {
    if (node.importKind === "type") {
        return;
    }
    const typeKeywordsRange: Array<[number, number]> = [];
    node.specifiers.forEach(specifier => {
        if (specifier.type === TSESTree.AST_NODE_TYPES.ImportSpecifier && specifier.importKind === "type") {
            // range of the `type` keyword
            typeKeywordsRange.push([specifier.range[0], specifier.range[0] + 5]);
        }
    });

    if (typeKeywordsRange.length === node.specifiers.length && typeKeywordsRange.length > 0) {
        context.report({
            node,
            messageId: "typeImportOutsideBracket",
            data: {
                currentNode: context.sourceCode.getText(node),
            },
            fix: fixer => {
                return [fixer.insertTextBeforeRange([typeKeywordsRange[0][0] - 1, typeKeywordsRange[0][1] + 1], "type "), ...typeKeywordsRange.map(([start, end]) => fixer.removeRange([start, end]))];
            },
        });
    }
}
