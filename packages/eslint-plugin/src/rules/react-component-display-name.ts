import type {TSESTree} from "@typescript-eslint/experimental-utils";
import {ASTUtils, AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";
import type {RuleContext} from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";
import {findClosestParent} from "../util/findClosestParent";
import {isReactComponent} from "../util/isReactComponent";

export type Options = [];

export type MessageIds = "noDisplayName" | "displayNameMismatch" | "staticDisplayName";

export const name = "react-component-display-name";

export const rule = ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
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
            noDisplayName: "Add displayName",
            displayNameMismatch: "displayName must be the same as exported name",
            staticDisplayName: "displayName must be static",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ClassDeclaration(node) {
                if (isReactComponent(node)) {
                    const componentName = node.id!.name!;
                    checkClassProperties(context, node, componentName);
                }
            },
            ClassExpression(node) {
                if (isReactComponent(node)) {
                    const exportNode = findClosestParent(node, AST_NODE_TYPES.ExportNamedDeclaration) as TSESTree.ExportNamedDeclaration;
                    if (exportNode?.declaration?.type === AST_NODE_TYPES.VariableDeclaration) {
                        // export TestName =
                        const firstDeclaration = exportNode.declaration.declarations[0];
                        const exportName = ASTUtils.isIdentifier(firstDeclaration.id) && firstDeclaration.id.name; // exportName = "TestName"
                        if (exportName) {
                            checkClassProperties(context, node, exportName);
                        }
                    }
                }
            },
            VariableDeclarator(node) {
                if (
                    node.id.type === AST_NODE_TYPES.Identifier &&
                    node.init?.type === AST_NODE_TYPES.CallExpression &&
                    node.init.callee.type === AST_NODE_TYPES.MemberExpression &&
                    node.init.callee.object.type === AST_NODE_TYPES.Identifier &&
                    node.init.callee.object.name === "ReactUtil" &&
                    node.init.callee.property.type === AST_NODE_TYPES.Identifier &&
                    (node.init.callee.property.name === "memo" || node.init.callee.property.name === "statics")
                ) {
                    const exportedName = node.id.name;
                    if (!(node.init.arguments[0].type === AST_NODE_TYPES.Literal && node.init.arguments[0].value === exportedName)) {
                        context.report({messageId: "displayNameMismatch", node, fix: fixer => fixer.replaceText((node.init! as any)["arguments"][0], `"${exportedName}"`)});
                    }
                }
            },
        };
    },
});

function checkClassProperties(context: Readonly<RuleContext<MessageIds, Options>>, classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression, displayName: string) {
    const {body} = classNode;
    const displayNameNode = body.body.find(_ => _.type === AST_NODE_TYPES.PropertyDefinition && ASTUtils.isIdentifier(_.key) && _.key.name === "displayName") as
        | TSESTree.PropertyDefinition
        | undefined;
    if (displayNameNode) {
        // Check if displayName is static
        if (!displayNameNode.static) {
            context.report({messageId: "staticDisplayName", node: displayNameNode, fix: fixer => fixer.insertTextBefore(displayNameNode, "static ")});
        }
        // Check if literal displayName matches
        if (displayNameNode.value?.type === AST_NODE_TYPES.Literal && displayNameNode.value.value !== displayName) {
            context.report({messageId: "displayNameMismatch", node: displayNameNode, fix: fixer => fixer.replaceText(displayNameNode.value!, `"${displayName}"`)});
        }
    } else {
        // Missing displayName
        // Class body starts with brace, + 1 to insert after brace.
        context.report({
            messageId: "noDisplayName",
            node: classNode.superClass!,
            fix: fixer => fixer.insertTextAfterRange([body.range[0] + 1, body.range[0] + 1], `\nstatic displayName = "${displayName}";\n`),
        });
    }
}
