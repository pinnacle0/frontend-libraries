import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/experimental-utils";

export function getClassMethod(classBody: TSESTree.ClassBody) {
    return classBody.body
        .map(classElement => {
            return classElement.type === AST_NODE_TYPES.MethodDefinition || classElement.type === AST_NODE_TYPES.TSAbstractMethodDefinition
                ? classElement
                : (classElement.type === AST_NODE_TYPES.PropertyDefinition || classElement.type === AST_NODE_TYPES.TSAbstractPropertyDefinition) &&
                  (classElement.value?.type === AST_NODE_TYPES.ArrowFunctionExpression || classElement.value?.type === AST_NODE_TYPES.FunctionExpression)
                ? classElement
                : null;
        })
        .filter(<T>(_: T | null): _ is T => _ !== null);
}
