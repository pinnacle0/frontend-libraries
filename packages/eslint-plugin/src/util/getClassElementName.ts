import type {TSESTree} from "@typescript-eslint/experimental-utils";
import {AST_NODE_TYPES} from "@typescript-eslint/experimental-utils";

export function getClassElementName(classElement: TSESTree.ClassElement): string | null {
    switch (classElement.type) {
        case AST_NODE_TYPES.StaticBlock:
        case AST_NODE_TYPES.TSIndexSignature:
            return null; // Don't know what this is, just ignore it
        case AST_NODE_TYPES.ClassProperty:
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.TSAbstractClassProperty:
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
            if (classElement.key.type === AST_NODE_TYPES.Identifier) {
                return classElement.key.name;
            } else {
                return null; // Don't care about PropertyNameNonComputed keys of type (StringLiteral | NumerLiteral), or PropertyNameComputed keys
            }
        default:
            return null;
    }
}
