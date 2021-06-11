import {ESLintUtils, AST_NODE_TYPES} from "@typescript-eslint/experimental-utils";
import type {RuleContext} from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";
import {isCoreFeOrCoreNativeModuleClass} from "../util/isCoreFeOrCoreNativeModuleClass";
import type {TSESTree} from "@typescript-eslint/experimental-utils";

export type Options = [];

export type MessageIds = "moduleClassLifecycleOrder";

export const name = "module-class-lifecycle-order";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "A Rule that checks if lifecycle methods should be ordered first in module class",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            moduleClassLifecycleOrder: '"{{methodName}}" has prefix "on" must be ordered first',
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

    if (!methodList.length) {
        return;
    }
    methodList.reduce((prevNode, currentNode) => {
        if (currentNode.key.type !== AST_NODE_TYPES.Identifier) {
            return prevNode;
        }

        const prevMethodName = (prevNode.key as TSESTree.Identifier).name;
        const currentMethodName = currentNode.key.name;

        if (prevNode && !isLifecycleMethod(prevMethodName) && isLifecycleMethod(currentMethodName) && currentNode.override) {
            context.report({
                node: currentNode,
                messageId: "moduleClassLifecycleOrder",
                data: {methodName: currentMethodName},
            });
        }

        return currentNode;
    });
}

function isLifecycleMethod(methodName: string) {
    return /^on([A-Z][\w]*)/.test(methodName) && methodName !== "onError";
}
