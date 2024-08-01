import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/utils";
import type {TSESTree} from "@typescript-eslint/utils";

export type MessageIds = "variableDeclarationModuleIdentifierShadowing";

export const name = "variable-declaration-module-identifier-shadowing";

export const rule = ESLintUtils.RuleCreator(_ => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            // Webpack React Refresh Plugin (https://github.com/pmmmwh/react-refresh-webpack-plugin) hard codes registering react component modules with `module.id`
            // If the identifier module is shadowed by user code, then module.id is no longer a valid property access and will break at runtime in development mode (when react refresh is active).
            variableDeclarationModuleIdentifierShadowing: "Do not declare variables with identifiers `module`. This may break webpack hot reloading and react fast refresh.",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        const checkImportSpecifier = (node: TSESTree.ImportSpecifier | TSESTree.ImportDefaultSpecifier) => {
            if (node.local.name === "module") {
                // Do not report if variable declaration is prefixed with TS specific `import type` keyword (e.g. `import type {module} from "some-file";`)
                const isTSImportType = node.parent?.type === AST_NODE_TYPES.ImportDeclaration && node.parent.importKind === "type";
                if (isTSImportType) {
                    return;
                }
                context.report({
                    node: node.local,
                    messageId: "variableDeclarationModuleIdentifierShadowing",
                });
            }
        };

        return {
            VariableDeclarator(node) {
                if (node.id.type === AST_NODE_TYPES.Identifier && node.id.name === "module") {
                    // Do not report if variable declaration is prefixed with TS `declare` keyword (e.g. `declare var module: any;`)
                    const isTSDeclareVariable = node.parent?.type === AST_NODE_TYPES.VariableDeclaration && node.parent.declare === true;
                    if (isTSDeclareVariable) {
                        return;
                    }
                    context.report({
                        node: node.id,
                        messageId: "variableDeclarationModuleIdentifierShadowing",
                    });
                }
            },
            ImportSpecifier(node) {
                checkImportSpecifier(node);
            },
            ImportDefaultSpecifier(node) {
                checkImportSpecifier(node);
            },
        };
    },
});
