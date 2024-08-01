import {AST_NODE_TYPES} from "@typescript-eslint/utils";
import type {TSESTree} from "@typescript-eslint/utils";

export function isReactComponent({superClass}: TSESTree.ClassDeclaration | TSESTree.ClassExpression): boolean {
    return (
        superClass?.type === AST_NODE_TYPES.MemberExpression &&
        superClass.object.type === AST_NODE_TYPES.Identifier &&
        superClass.object.name === "React" &&
        superClass.property?.type === AST_NODE_TYPES.Identifier &&
        ["Component", "PureComponent"].includes(superClass.property.name)
    );
}
