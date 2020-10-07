import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/experimental-utils";

export function getClassElementCategory(classElement: TSESTree.ClassElement): "constructor" | "method-or-arrow-function" | "field" {
    switch (classElement.type) {
        case AST_NODE_TYPES.MethodDefinition:
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
            if (classElement.kind === "constructor") {
                return "constructor";
            }
            return "method-or-arrow-function";
        case AST_NODE_TYPES.ClassProperty:
        case AST_NODE_TYPES.TSAbstractClassProperty:
            if (classElement.value?.type === AST_NODE_TYPES.ArrowFunctionExpression || classElement.value?.type === AST_NODE_TYPES.FunctionExpression) {
                return "method-or-arrow-function"; // Treat arrow function expressions as methods
            }
            return "field";
        case AST_NODE_TYPES.TSIndexSignature:
            return "field"; // Don't care what this is
    }
}
