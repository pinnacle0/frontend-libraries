import type {TSESTree} from "@typescript-eslint/experimental-utils";
import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";
import type {RuleContext} from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";
import {isCoreFeOrCoreNativeModuleClass} from "../util/isCoreFeOrCoreNativeModuleClass";

export type Options = [];

export type MessageIds = "onPrefixedMethodNotLifecycle" | "lifecycleDecoratorOrder" | "logDecoratorOrder" | "lifecycleDecoratorWithLogDecorator";

export const name = "module-class-method-decorators";

export const rule = ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            onPrefixedMethodNotLifecycle: '"{{methodName}}" has prefix "on" and must be @Lifecycle()',
            lifecycleDecoratorOrder: "@Lifecycle() must be the first decorator",
            logDecoratorOrder: "@Log() must be the last decorator",
            lifecycleDecoratorWithLogDecorator: "@Log() should not be used with @Lifecycle()",
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

function checkClassBody(context: Readonly<RuleContext<MessageIds, Options>>, classBody: TSESTree.ClassBody) {
    const methodList = classBody.body
        .map(classElement => {
            return classElement.type === AST_NODE_TYPES.MethodDefinition || classElement.type === AST_NODE_TYPES.TSAbstractMethodDefinition
                ? classElement
                : (classElement.type === AST_NODE_TYPES.ClassProperty || classElement.type === AST_NODE_TYPES.TSAbstractClassProperty) &&
                  (classElement.value?.type === AST_NODE_TYPES.ArrowFunctionExpression || classElement.value?.type === AST_NODE_TYPES.FunctionExpression)
                ? classElement
                : null;
        })
        .filter(<T>(_: T | null): _ is T => _ !== null);
    methodList.forEach(methodNode => {
        if (methodNode.key.type !== AST_NODE_TYPES.Identifier) {
            return;
        }

        const methodName = methodNode.key.name;
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
        const lifecycleDecorator = methodDecorators?.find(_ => _.decoratorName === "Lifecycle") || null;
        const logDecorator = methodDecorators?.find(_ => _.decoratorName === "Log") || null;

        if (/^on([A-Z][\w]*)/.test(methodName) && methodName !== "onError" && lifecycleDecorator === null) {
            context.report({
                messageId: "onPrefixedMethodNotLifecycle",
                node: methodNode,
                data: {methodName},
                fix: fixer => fixer.insertTextBeforeRange(methodNode.range, "@Lifecycle()\n"),
            });
        }
        if (methodDecorators !== null) {
            if (lifecycleDecorator !== null && lifecycleDecorator.index !== 0) {
                context.report({
                    messageId: "lifecycleDecoratorOrder",
                    node: lifecycleDecorator.decoratorNode,
                    fix: fixer => [
                        // (1) Remove @Lifecycle()
                        fixer.removeRange(lifecycleDecorator.decoratorNode.range),
                        // (2) Insert @Lifecycle() before first decorator
                        fixer.insertTextBefore(methodDecorators[0].decoratorNode, "@Lifecycle()\n"),
                    ],
                });
            }
            if (logDecorator !== null && logDecorator.index !== methodDecorators.length - 1) {
                context.report({
                    messageId: "logDecoratorOrder",
                    node: logDecorator.decoratorNode,
                    fix: fixer => [
                        // (1) Insert @Lifecycle() after last decorator
                        fixer.insertTextAfter(methodDecorators[methodDecorators.length - 1].decoratorNode, "@Log()\n"),
                        // (2) Remove @Log()
                        fixer.removeRange(logDecorator.decoratorNode.range),
                    ],
                });
            }
            if (lifecycleDecorator !== null && logDecorator !== null) {
                context.report({
                    messageId: "lifecycleDecoratorWithLogDecorator",
                    node: logDecorator.decoratorNode,
                    fix: fixer => fixer.removeRange(logDecorator.decoratorNode.range),
                });
            }
        }
    });
}
