import {ESLintUtils, TSESTree} from "@typescript-eslint/experimental-utils";
import {RuleContext} from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";
import {getRawGenericsOfSuperClass} from "../util/getRawGenericsOfSuperClass";
import {isReactComponent} from "../util/isReactComponent";

export type Options = [];

export type MessageIds = "reactComponentPropsTyping";

export const name = "react-component-default-props-typing";

export const rule = ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Specify generic type of React.Component or React.PureComponent when declaring a class component",
            category: "Best Practices",
            recommended: "error",
        },
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

function checkComponentClass(context: Readonly<RuleContext<MessageIds, Options>>, classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression) {
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
