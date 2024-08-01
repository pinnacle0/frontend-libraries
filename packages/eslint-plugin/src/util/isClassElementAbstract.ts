import type {TSESTree} from "@typescript-eslint/utils";
import {AST_NODE_TYPES} from "@typescript-eslint/utils";

export function isClassElementAbstract(classElement: TSESTree.ClassElement): boolean {
    switch (classElement.type) {
        case AST_NODE_TYPES.PropertyDefinition:
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.TSIndexSignature:
        case AST_NODE_TYPES.StaticBlock:
        case AST_NODE_TYPES.AccessorProperty:
            return false;
        case AST_NODE_TYPES.TSAbstractAccessorProperty:
        case AST_NODE_TYPES.TSAbstractPropertyDefinition:
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
            return true;
    }
}
