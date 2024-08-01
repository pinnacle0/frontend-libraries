import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/utils";
import {getClassElementCategory} from "../util/getClassElementCategory";
import {getClassElementName} from "../util/getClassElementName";
import {getRawGenericsOfSuperClass} from "../util/getRawGenericsOfSuperClass";
import {isReactComponent} from "../util/isReactComponent";
import type {TSESTree, TSESLint} from "@typescript-eslint/utils";

export type Options = [];

export type MessageIds = "reactComponentStateMember";

export const name = "react-component-state-member";

export const rule = ESLintUtils.RuleCreator(_ => name)<Options, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Initialize component state inside constructor instead of using class field declaration",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            reactComponentStateMember: "Put state initialization inside constructor",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {
            ClassDeclaration(node) {
                if (isReactComponent(node)) {
                    checkClassBody(context, node, node.body);
                }
            },
            ClassExpression(node) {
                if (isReactComponent(node)) {
                    checkClassBody(context, node, node.body);
                }
            },
        };
    },
});

function checkClassBody(context: Readonly<TSESLint.RuleContext<MessageIds, Options>>, classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression, classBody: TSESTree.ClassBody) {
    classBody.body.forEach(classElement => {
        if (classElement.type !== AST_NODE_TYPES.PropertyDefinition && classElement.type !== AST_NODE_TYPES.TSAbstractPropertyDefinition) {
            return; // Allow type narrowing on classElement.type
        }
        if (!classElement.static && !classElement.declare && getClassElementName(classElement) === "state") {
            const stateDeclarationSourceCode = context.sourceCode.getText(classElement);
            const constructorEndLocation = classBody.body.find(_ => getClassElementCategory(_) === "constructor")?.range[1];
            const propsGenericAnnotation = getRawGenericsOfSuperClass(context, classNode)?.[0] || null;
            context.report({
                messageId: "reactComponentStateMember",
                node: classElement,
                fix: fixer =>
                    constructorEndLocation
                        ? [fixer.insertTextAfterRange([constructorEndLocation - 1, constructorEndLocation - 1], `this.${stateDeclarationSourceCode}`), fixer.removeRange(classElement.range)]
                        : fixer.replaceTextRange(classElement.range, `constructor(props${propsGenericAnnotation ? `: ${propsGenericAnnotation}` : ""}) {this.${stateDeclarationSourceCode}}`),
            });
        }
    });
}
