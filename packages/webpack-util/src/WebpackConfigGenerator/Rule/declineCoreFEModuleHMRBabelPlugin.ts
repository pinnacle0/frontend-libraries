import type * as babel from "@babel/core";

interface State extends Pick<babel.PluginPass, "file" | "key" | "opts" | "cwd" | "filename"> {
    hasInjectedDeclineWebpackHMRNode: boolean;
}

/**
 * Injects `if (module.hot) module.hot.decline()` code snippet in files that contains "core-fe" Module classes.
 *
 * This tells webpack HMR to force refresh the browser when a file containing "core-fe" Module classes is changed,
 * otherwise react loses refrence of the MainComponent created by `ModuleProxy` in "core-fe"
 * and throws a runtime error during development (which is bad for developer experience).
 */
export default function declineCoreFEModuleHMRBabelPlugin({types: t}: typeof babel): babel.PluginObj<State> {
    return {
        visitor: {
            ImportDeclaration(path, state) {
                if (state.hasInjectedDeclineWebpackHMRNode) {
                    return;
                }

                const {
                    node: {
                        source: {value: importSource},
                        specifiers: importSpecifiers,
                    },
                } = path;

                if (importSource !== "core-fe") {
                    return;
                }

                if (!hasImportSpecifierOfIdentifierModule(t, importSpecifiers)) {
                    return;
                }

                // We now know the TS/JS file has included `Module`, inject the code snippet
                const programPath = path.findParent(parentPath => t.isProgram(parentPath.node))! as babel.NodePath<babel.types.Program>;

                // prettier-ignore
                const declineWebpackHMRNode = t.ifStatement(
                    t.memberExpression(
                        t.identifier("module"),
                        t.identifier("hot")
                    ),
                    t.expressionStatement(
                        t.callExpression(
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier("module"),
                                    t.identifier("hot"),
                                ),
                                t.identifier("decline"),
                            ),
                            [],
                        ),
                    ),
                );

                // Append `if (module.hot) module.hot.decline()` to end of program body
                programPath.pushContainer("body", declineWebpackHMRNode);

                // We only need to inject the code snippet once per file, mark as injected
                state.hasInjectedDeclineWebpackHMRNode = true;
            },
        },
    };
}

/**
 * @param t `babel.types`
 * @param importSpecifiers The "specifier" property of a `babel.types.ImportDeclaration` node
 * @returns true if the import declaration includes the identifier `Module`
 */
function hasImportSpecifierOfIdentifierModule(t: typeof babel.types, importSpecifiers: babel.types.ImportDeclaration["specifiers"]): boolean {
    const specifier = importSpecifiers.find(specifier => {
        // Check if it is one of:
        // -> `import { <IMPORT_SPECIFIER_NODE> } from "core-fe";`
        // -> `import DontCareDefaultIdent, { <IMPORT_SPECIFIER_NODE> } from "core-fe";`
        if (t.isImportSpecifier(specifier)) {
            const importedSpecifier = specifier.imported;
            return t.isIdentifier(importedSpecifier) && importedSpecifier.name === "Module";
        }

        // Check if it is:
        // -> `import * as <IMPORT_NAMESPACE_SPECIFIER_NODE> from "core-fe";`
        if (t.isImportNamespaceSpecifier(specifier)) {
            // Not worth the effort to check if <IMPORT_NAMESPACE_SPECIFIER_NODE>.Module is used
            // Maybe enforce "core-fe" should not be imported with a namespace with an ESLint rule?
            return true;
        }

        return false;
    });
    return specifier !== undefined;
}
