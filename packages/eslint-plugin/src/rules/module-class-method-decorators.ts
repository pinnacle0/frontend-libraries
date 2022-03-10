import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";
import {getClassMethod} from "../util/getClassMethod";
import {isCoreFeOrCoreNativeModuleClass} from "../util/isCoreFeOrCoreNativeModuleClass";
import type {TSESTree, TSESLint} from "@typescript-eslint/experimental-utils";

export type Options = [];

export type MessageIds = "logDecoratorOrder";

export const name = "module-class-method-decorators";

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
            logDecoratorOrder: "@Log() must be the last decorator",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ClassDeclaration(node) {
                if (isCoreFeOrCoreNativeModuleClass(context, node)) {
                    checkClassBody(context, node.body);
                }
            },
            ClassExpression(node) {
                if (isCoreFeOrCoreNativeModuleClass(context, node)) {
                    checkClassBody(context, node.body);
                }
            },
        };
    },
});

function checkClassBody(context: Readonly<TSESLint.RuleContext<MessageIds, Options>>, classBody: TSESTree.ClassBody) {
    const methodList = getClassMethod(classBody);

    methodList.forEach(methodNode => {
        if (methodNode.key.type !== AST_NODE_TYPES.Identifier) {
            return;
        }

        const methodDecorators =
            methodNode.decorators
                ?.map((decoratorNode, index) => {
                    return decoratorNode.type === AST_NODE_TYPES.Decorator &&
                        decoratorNode.expression.type === AST_NODE_TYPES.CallExpression &&
                        decoratorNode.expression.callee.type === AST_NODE_TYPES.Identifier
                        ? {index, decoratorNode, decoratorName: decoratorNode.expression.callee.name}
                        : null;
                })
                .filter(<T>(_: T | null): _ is T => _ !== null) || null;
        const logDecorator = methodDecorators?.find(_ => _.decoratorName === "Log") || null;

        if (methodDecorators !== null) {
            if (logDecorator !== null && logDecorator.index !== methodDecorators.length - 1) {
                context.report({
                    messageId: "logDecoratorOrder",
                    node: logDecorator.decoratorNode,
                    fix: fixer => [
                        // (1) Insert @Log() after last decorator
                        fixer.insertTextAfter(methodDecorators[methodDecorators.length - 1].decoratorNode, "\n@Log()"),
                        // (2) Remove @Log()
                        fixer.removeRange(logDecorator.decoratorNode.range),
                    ],
                });
            }
        }
    });
}
