import {ASTUtils, AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";
import type {TSESTree} from "@typescript-eslint/experimental-utils";

export type MessageIds = "stylePropertiesType";

export const name = "style-properties-type";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            recommended: "error",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            stylePropertiesType: "React.CSSProperties' name must end with 'Style', e.g: containerStyle, inputStyle",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            VariableDeclarator(node) {
                if (ASTUtils.isIdentifier(node.id) && node.id.typeAnnotation && node.id.typeAnnotation.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference) {
                    if (isCSSProperties(node.id.typeAnnotation.typeAnnotation) && !node.id.name.endsWith("Style")) {
                        context.report({
                            node: node.id,
                            messageId: "stylePropertiesType",
                            fix: fixer => fixer.insertTextAfterRange([node.id.range[0], node.id.range[0] + (node.id as TSESTree.Identifier).name.length], "Style"),
                        });
                    }
                }
            },
        };
    },
});

function isCSSProperties(node: TSESTree.TSTypeReference): boolean {
    return (
        (node.typeName.type === AST_NODE_TYPES.Identifier && node.typeName.name === "CSSProperties") ||
        (node.typeName.type === AST_NODE_TYPES.TSQualifiedName &&
            ASTUtils.isIdentifier(node.typeName.left) &&
            node.typeName.left.name === "React" &&
            ASTUtils.isIdentifier(node.typeName.right) &&
            node.typeName.right.name === "CSSProperties")
    );
}
