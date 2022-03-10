import {ESLintUtils} from "@typescript-eslint/experimental-utils";
import {isCoreFeOrCoreNativeModuleClass} from "../util/isCoreFeOrCoreNativeModuleClass";
import {getClassMethod} from "../util/getClassMethod";
import type {TSESLint, TSESTree} from "@typescript-eslint/experimental-utils";

export type Options = [];

export type MessageIds = "moduleClassLifecycleOrder";

export const name = "module-class-lifecycle-order";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "A Rule that checks if lifecycle methods should be ordered first in module class",
            recommended: "error",
        },
        hasSuggestions: true,
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

function checkClassBody(context: Readonly<TSESLint.RuleContext<MessageIds, Options>>, classBody: TSESTree.ClassBody) {
    const methodList = getClassMethod(classBody);

    let prevNodeIndex = 0;
    for (let i = 1; i < methodList.length; i++) {
        const prevNode = methodList[prevNodeIndex];
        const currentNode = methodList[i];

        const prevMethodName = (prevNode.key as TSESTree.Identifier).name;
        const currentMethodName = (currentNode.key as TSESTree.Identifier).name;

        if (!isLifecycleMethod(prevMethodName) && isLifecycleMethod(currentMethodName) && currentNode.override) {
            context.report({
                node: currentNode,
                messageId: "moduleClassLifecycleOrder",
                data: {methodName: currentMethodName},
            });
            break;
        }
        prevNodeIndex = i;
    }
}

function isLifecycleMethod(methodName: string) {
    return /^on([A-Z][\w]*)/.test(methodName) && methodName !== "onError";
}
