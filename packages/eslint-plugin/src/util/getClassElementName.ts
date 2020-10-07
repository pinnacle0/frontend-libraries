import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/experimental-utils";

export function getClassElementName(classElement: TSESTree.ClassElement): string | null {
    switch (classElement.type) {
        case AST_NODE_TYPES.TSIndexSignature:
            return null; // Don't know what this is, just ignore it
        case AST_NODE_TYPES.ClassProperty:
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.TSAbstractClassProperty:
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
            if (classElement.key.type === AST_NODE_TYPES.Identifier) {
                return classElement.key.name;
            }
            return null; // Don't care about PropertyNameNonComputed keys of type (StringLiteral | NumerLiteral), or PropertyNameComputed keys
    }
}
