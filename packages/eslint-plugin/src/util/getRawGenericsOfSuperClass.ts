import type {TSESTree} from "@typescript-eslint/experimental-utils";
import type {SourceCode} from "@typescript-eslint/experimental-utils/dist/ts-eslint";

export function getRawGenericsOfSuperClass(
    context: {getSourceCode: () => Readonly<SourceCode>},
    classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression
): [string, ...(string | undefined)[]] | null {
    const typeNode = classNode.superTypeParameters || null;
    if (typeNode) {
        const sourceCode = context.getSourceCode();
        const rawGenerics = typeNode.params.map(typeParam => sourceCode.getText(typeParam));
        if (rawGenerics.length > 0) {
            return rawGenerics as [string, ...(string | undefined)[]];
        }
    }
    return null;
}
