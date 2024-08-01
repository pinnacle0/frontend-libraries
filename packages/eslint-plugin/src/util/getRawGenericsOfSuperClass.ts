import type {TSESTree, TSESLint} from "@typescript-eslint/utils";

export function getRawGenericsOfSuperClass(
    context: {getSourceCode: () => Readonly<TSESLint.SourceCode>},
    classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression
): [string, ...(string | undefined)[]] | null {
    const typeNode = classNode.superTypeArguments || null;
    if (typeNode) {
        const sourceCode = context.getSourceCode();
        const rawGenerics = typeNode.params.map(typeParam => sourceCode.getText(typeParam));
        if (rawGenerics.length > 0) {
            return rawGenerics as [string, ...(string | undefined)[]];
        }
    }
    return null;
}
