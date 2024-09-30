import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/utils";

export function isConstInFirstLayer(node: TSESTree.VariableDeclarator): boolean {
    const parent = node.parent;
    if (parent && parent.type === AST_NODE_TYPES.VariableDeclaration && parent.kind === "const") {
        const grandParent = parent.parent;
        return grandParent && (grandParent.type === AST_NODE_TYPES.Program || grandParent.type === AST_NODE_TYPES.ExportNamedDeclaration);
    }
    return false;
}
