import type {TSESTree} from "@typescript-eslint/utils";
import {AST_NODE_TYPES} from "@typescript-eslint/utils";

export function getClassElementCategory(classElement: TSESTree.ClassElement): "constructor" | "method-or-arrow-function" | "field" {
    switch (classElement.type) {
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
            if (classElement.kind === "constructor") {
                return "constructor";
            }
            return "method-or-arrow-function";
        case AST_NODE_TYPES.PropertyDefinition:
        case AST_NODE_TYPES.AccessorProperty:
        case AST_NODE_TYPES.TSAbstractAccessorProperty:
        case AST_NODE_TYPES.TSAbstractPropertyDefinition:
            if (classElement.value?.type === AST_NODE_TYPES.ArrowFunctionExpression || classElement.value?.type === AST_NODE_TYPES.FunctionExpression) {
                return "method-or-arrow-function"; // Treat arrow function expressions as methods
            }
            return "field";
        case AST_NODE_TYPES.StaticBlock:
        case AST_NODE_TYPES.TSIndexSignature:
            return "field"; // Don't care what this is
    }
}
