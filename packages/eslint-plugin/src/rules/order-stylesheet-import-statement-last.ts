import type {TSESTree} from "@typescript-eslint/experimental-utils";
import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "orderStylesheetImportStatementLast";

export const name = "order-stylesheet-import-statement-last";

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
            orderStylesheetImportStatementLast: "style sheet imports should always at the bottom of all import statements.",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            Program(node) {
                const importDeclarations = node.body.filter(_ => _.type === AST_NODE_TYPES.ImportDeclaration) as TSESTree.ImportDeclaration[];
                const importSource = importDeclarations.map(_ => _.source.raw);
                const stylesheetExtensionRegex = /\.(css|scss|sass|less)['"]$/;
                const firstStyleSheetImport = importSource.find(_ => stylesheetExtensionRegex.test(_));
                if (!firstStyleSheetImport) {
                    return;
                }
                const indexOfStyleSheet = importSource.indexOf(firstStyleSheetImport);
                let itr = indexOfStyleSheet + 1;
                while (itr < importSource.length) {
                    if (!stylesheetExtensionRegex.test(importSource[itr])) {
                        const importCode = "\n" + context.getSourceCode().getText(importDeclarations[indexOfStyleSheet]);
                        context.report({
                            node: importDeclarations[indexOfStyleSheet],
                            messageId: "orderStylesheetImportStatementLast",
                            fix: fixer => [fixer.remove(importDeclarations[indexOfStyleSheet]), fixer.insertTextAfter(importDeclarations[importDeclarations.length - 1], importCode)],
                        });
                        break;
                    }
                    itr++;
                }
            },
        };
    },
});
