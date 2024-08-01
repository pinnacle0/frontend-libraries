import type {TSESTree, TSESLint} from "@typescript-eslint/utils";
import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/utils";
import {getClassElementCategory} from "../util/getClassElementCategory";
import {getClassElementName} from "../util/getClassElementName";
import {isClassElementAbstract} from "../util/isClassElementAbstract";
import {isReactComponent} from "../util/isReactComponent";
import {isReactComponentLifecyleMethod} from "../util/isReactComponentLifecyleMethod";

export type Options = [];

export type MessageIds = "reactComponentMethodOrdering";

export const name = "react-component-method-ordering";

export interface CheckableClassElements {
    index: number;
    classElement: TSESTree.ClassElement;
    groupLabel: string;
    name: string;
    category: "constructor" | "method-or-arrow-function" | "field";
    isAbstract: boolean;
    isStatic: boolean;
    accessibility: TSESTree.Accessibility;
}

export interface MethodOrderChecker {
    type: "lifecyle-method" | "custom-function" | "event-handler" | "custom-render-function" | "react-render-function";
    validator: (methodName: string) => boolean;
}

export const methodOrderCheckers: ReadonlyArray<MethodOrderChecker> = [
    {
        type: "lifecyle-method",
        validator: function isLifecycleMethodExceptRender(methodName) {
            return isReactComponentLifecyleMethod(methodName) && methodName !== "render";
        },
    },
    {
        type: "custom-function",
        validator: function isCustomFunction(methodName) {
            return [/^on[A-Z].*/.test(methodName), /^render.*/.test(methodName)].every(_ => _ === false);
        },
    },
    {
        type: "event-handler",
        validator: function isEventHandler(methodName) {
            return /^on[A-Z].*/.test(methodName);
        },
    },
    {
        type: "custom-render-function",
        validator: function isCustomRenderFunction(methodName) {
            return /^render[A-Z].*/.test(methodName);
        },
    },
    {
        type: "react-render-function",
        validator: function isReactRenderFunction(methodName) {
            return /^render$/.test(methodName);
        },
    },
];

export const rule = ESLintUtils.RuleCreator(_ => name)<Options, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Order react component methods according to pinnacle react component guideline",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            reactComponentMethodOrdering: "Method [{{methodName}}] is a {{methodType}}, and should be placed before {{prevCheckerType}}",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ClassDeclaration(node) {
                if (isReactComponent(node)) {
                    checkClassBody(context, node.body);
                }
            },
            ClassExpression(node) {
                if (isReactComponent(node)) {
                    checkClassBody(context, node.body);
                }
            },
        };
    },
});

function checkClassBody(context: Readonly<TSESLint.RuleContext<MessageIds, Options>>, classBody: TSESTree.ClassBody) {
    const methodList: readonly CheckableClassElements[] = getClassMethods(classBody);
    const groupedMethods = methodList.reduce<{[key: string]: readonly CheckableClassElements[]}>((prev, method) => {
        const group = (prev[method.groupLabel] || []).concat([method]);
        return Object.assign(prev, {[method.groupLabel]: group});
    }, {});
    Object.entries(groupedMethods).forEach(([, methodGroup]) => {
        checkClassMethodList(context, methodGroup);
    });
}

function getClassMethods(classBody: TSESTree.ClassBody): CheckableClassElements[] {
    return classBody.body
        .map((classElement, index): CheckableClassElements | null => {
            const name = getClassElementName(classElement);
            if (name === null) {
                return null;
            }
            const category = getClassElementCategory(classElement);
            if (category !== "method-or-arrow-function") {
                return null;
            }
            const isAbstract = isClassElementAbstract(classElement);
            const isStatic = classElement.type === AST_NODE_TYPES.StaticBlock || classElement.static || false;
            const accessibility = classElement.type === AST_NODE_TYPES.StaticBlock || !classElement.accessibility ? "public" : classElement.accessibility;
            const groupLabel = [accessibility, isStatic ? "static" : isAbstract ? "abstract" : "instance", "method"].filter(_ => _ !== null).join("-");
            return {index, classElement, groupLabel, name, category, isAbstract, isStatic, accessibility};
        })
        .filter((_): _ is CheckableClassElements => _ !== null);
}

function checkClassMethodList(context: Readonly<TSESLint.RuleContext<MessageIds, Options>>, classMethodList: readonly CheckableClassElements[]) {
    let prevCheckerIndex = 0;
    for (const wrappedMethod of classMethodList) {
        const currentCheckerIndex = methodOrderCheckers.findIndex(_ => _.validator(wrappedMethod.name));
        if (currentCheckerIndex === -1) {
            continue;
        }
        if (currentCheckerIndex < prevCheckerIndex) {
            context.report({
                messageId: "reactComponentMethodOrdering",
                node: wrappedMethod.classElement,
                data: {
                    methodName: wrappedMethod.name,
                    prevCheckerType: methodOrderCheckers[prevCheckerIndex].type,
                    methodType: methodOrderCheckers[currentCheckerIndex].type,
                },
            });
        } else {
            prevCheckerIndex = currentCheckerIndex;
        }
    }
}
