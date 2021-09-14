import type {TSESTree} from "@typescript-eslint/experimental-utils";
import {AST_NODE_TYPES} from "@typescript-eslint/experimental-utils";

export function isClassElementAbstract(classElement: TSESTree.ClassElement): boolean {
    switch (classElement.type) {
        case AST_NODE_TYPES.ClassProperty:
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.TSIndexSignature:
        case AST_NODE_TYPES.StaticBlock:
            return false;
        case AST_NODE_TYPES.TSAbstractClassProperty:
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
            return true;
    }
}
