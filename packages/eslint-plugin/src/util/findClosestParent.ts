import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/experimental-utils";

export function findClosestParent(node: TSESTree.Node, type: AST_NODE_TYPES): TSESTree.Node | undefined {
    return node.type === type ? node : node.parent && findClosestParent(node.parent, type);
}
