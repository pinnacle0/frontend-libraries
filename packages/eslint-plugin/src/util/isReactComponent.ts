import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/typescript-estree";

export function isReactComponent({superClass}: TSESTree.ClassDeclaration | TSESTree.ClassExpression): boolean {
    return (
        superClass?.type === AST_NODE_TYPES.MemberExpression &&
        superClass.object.type === AST_NODE_TYPES.Identifier &&
        superClass.object.name === "React" &&
        superClass.property?.type === AST_NODE_TYPES.Identifier &&
        ["Component", "PureComponent"].includes(superClass.property.name)
    );
}
