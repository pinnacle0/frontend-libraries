import {ReportFixFunction, RuleContext, RuleFixer} from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import type {TSESTree} from "@typescript-eslint/experimental-utils";

interface Import {
    node: TSESTree.ImportDeclaration;
    ranking: {
        type: number;
        path: number;
    };
}
export type MessageIds = "importOrdering" | "importOrderingLast";

export interface ReportMessageData {
    path: string;
    prevNodeInRightOrder?: string;
}

/**
 * Import declaration order checking procedure
 *
 * 1. Check the import declarations ranking based on import type in following order
 *    - Named and Default Import
 *    - Type Import
 *    - Side Effect Import
 *    - StyleSheet Import
 *
 * 2. Check the import declarations ranking based on path within each import type group in following order
 *    - start with `react`
 *    - start with `core`
 *    - start with `@pinnacle0`
 *    - start with '@'
 *    - Normal module import
 *    - Nested relative path import
 *    - relative path import
 */

// sorting principle: deps path -> import statement length (increasing) ->  deps path alphabet
export class ImportSorter<Options extends readonly unknown[]> {
    private static PathOrder = [
        /^"react"$/,
        /^"react/,
        /^"core-.+"$/,
        /^"@pinnacle0.+"$/,
        /^"@.+$/,
        // Deps path which is not relative
        /^"(?!\.)/,
        // Deps path with relative path
        /^"\.\.\/.+"$/,
        // Deps with nearest path
        /^"\.\/.+"$/,
    ];
    private static UnknownRanking = 1000;

    private imports: Import[] = [];

    constructor(private context: Readonly<RuleContext<MessageIds, Options>>) {}

    register(node: TSESTree.ImportDeclaration) {
        const result = this.computeRanking(node);
        this.imports.push(result);
    }

    clear() {
        this.imports = [];
    }

    report() {
        const rightOrder = this.getRightImportOrder();
        for (const [index, currentImport] of this.imports.entries()) {
            const correspondingRightOrderImport = rightOrder[index];

            /**
             * The case which wrong ordered import should be the start of all import is not going to happen,
             * since ordering checking start from the beginning of all import, and stop immediately after first wrong import
             */
            if (currentImport !== correspondingRightOrderImport) {
                const indexOfRightOrderOfCurrentImport = rightOrder.findIndex(_ => _ === currentImport);
                const reportNode = currentImport.node;
                const prevImportInRightOrder = rightOrder[indexOfRightOrderOfCurrentImport - 1];
                const sourceCode = this.context.getSourceCode();

                if (indexOfRightOrderOfCurrentImport === rightOrder.length - 1) {
                    this.context.report({
                        messageId: "importOrderingLast",
                        node: reportNode,
                        data: {
                            currentNode: sourceCode.getText(reportNode),
                        },
                        fix: fixer => this.fix(fixer, rightOrder),
                    });
                } else {
                    this.context.report({
                        messageId: "importOrdering",
                        node: reportNode,
                        data: {
                            currentNode: sourceCode.getText(reportNode),
                            prevNodeInRightOrder: this.context.getSourceCode().getText(prevImportInRightOrder.node),
                        },
                        fix: fixer => this.fix(fixer, rightOrder),
                    });
                }
                break;
            } else {
                continue;
            }
        }
    }

    private computeRanking(node: TSESTree.ImportDeclaration): Import {
        return {
            node,
            ranking: {
                type: this.getTypeRanking(node),
                path: this.getPathRanking(node),
            },
        };
    }

    private getPathRanking(node: TSESTree.ImportDeclaration) {
        let ranking = ImportSorter.UnknownRanking;
        for (const [index, reg] of ImportSorter.PathOrder.entries()) {
            if (reg.test(node.source.raw)) {
                ranking = index;
                break;
            } else {
                continue;
            }
        }
        return ranking;
    }

    private getTypeRanking(node: TSESTree.ImportDeclaration) {
        if (this.isTypeImport(node)) {
            return 1;
        } else if (this.isStyleImport(node)) {
            return 3;
        } else if (this.isSideEffectImport(node)) {
            return 2;
        } else {
            return 0;
        }
    }

    private getRightImportOrder(): Import[] {
        return [...this.imports].sort((first, second) => {
            const typeResult = first.ranking.type - second.ranking.type;
            if (typeResult !== 0) {
                return typeResult;
            } else {
                const pathResult = first.ranking.path - second.ranking.path;
                return pathResult;
            }
        });
    }

    private isTypeImport({importKind}: TSESTree.ImportDeclaration) {
        return importKind === "type";
    }

    private isSideEffectImport(node: TSESTree.ImportDeclaration) {
        const text = this.context.getSourceCode().getText(node);
        if (!/.+{.+}.+/.test(text) && node.importKind === "value" && node.specifiers.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    private isStyleImport(node: TSESTree.ImportDeclaration) {
        return /\.(css|scss|sass|less)['"]$/.test(node.source.raw);
    }

    private fix = (fixer: RuleFixer, order: Import[]): ReturnType<ReportFixFunction> => {
        const sourceCode = this.context.getSourceCode();
        return this.imports.map((target, index) => fixer.replaceText(target.node, sourceCode.getText(order[index].node)));
    };
}
