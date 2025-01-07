import type {TSESTree, TSESLint} from "@typescript-eslint/utils";
import {ESLintUtils} from "@typescript-eslint/utils";
import {getRawGenericsOfSuperClass} from "../util/getRawGenericsOfSuperClass.js";
import {isReactComponent} from "../util/isReactComponent.js";

export type Options = [];

export type MessageIds = "reactComponentPropsTyping";

export const name = "react-component-default-props-typing";

export const rule = ESLintUtils.RuleCreator(_ => name)<Options, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Specify generic type of React.Component or React.PureComponent when declaring a class component",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            reactComponentPropsTyping: "Declare React.{{componentOrPureComponent}} with type annotation parameters",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ClassDeclaration(node) {
                if (isReactComponent(node)) {
                    checkComponentClass(context, node);
                }
            },
            ClassExpression(node) {
                if (isReactComponent(node)) {
                    checkComponentClass(context, node);
                }
            },
        };
    },
});

function checkComponentClass(context: Readonly<TSESLint.RuleContext<MessageIds, Options>>, classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression) {
    const propsGenericAnnotation = getRawGenericsOfSuperClass(context, classNode)?.[0] || null;
    if (propsGenericAnnotation === null) {
        const componentOrPureComponent = ((classNode.superClass as TSESTree.MemberExpression).property as TSESTree.Identifier).name === "Component" ? "Component" : "PureComponent";
        context.report({
            messageId: "reactComponentPropsTyping",
            node: classNode.superClass!,
            data: {componentOrPureComponent},
        });
    }
}
