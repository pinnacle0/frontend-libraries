import type {TSESTree} from "@typescript-eslint/experimental-utils";
import {AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/experimental-utils";
import type {RuleContext} from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";
import {getClassElementCategory} from "../util/getClassElementCategory";
import {getClassElementName} from "../util/getClassElementName";
import {isReactComponent} from "../util/isReactComponent";

export type Options = [];

export type MessageIds = "reactComponentChangeHandlerNaming" | "reactComponentClickHandlerNaming";

export const name = "react-component-event-handler-naming";

export const rule = ESLintUtils.RuleCreator(name => name)<Options, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Use onXxxChange instead of onChangeXxx, and onXxxClick instead of onClickXxx for event handler naming",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            reactComponentChangeHandlerNaming: 'Name change handlers "{{suggestedName}}" instead of "{{methodName}}"',
            reactComponentClickHandlerNaming: 'Name click handlers "{{suggestedName}}" instead of "{{methodName}}"',
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

const incorrectOnChangeRegExp = /^onChange(\w+)$/;

const incorrectOnClickRegExp = /^onClick(\w+)$/;

function checkClassBody(context: Readonly<RuleContext<MessageIds, Options>>, classBody: TSESTree.ClassBody) {
    classBody.body.forEach(classElement => {
        if (classElement.type === AST_NODE_TYPES.TSIndexSignature || classElement.type === AST_NODE_TYPES.StaticBlock) {
            return; // Allow type narrowing on classElement.type
        }

        const methodName = getClassElementName(classElement);
        const category = getClassElementCategory(classElement);

        if (methodName && category === "method-or-arrow-function") {
            const reportError = (messageId: MessageIds, suggestedName: string) => {
                context.report({
                    messageId,
                    node: classElement,
                    data: {suggestedName, methodName},
                    fix: classElement.key.type !== AST_NODE_TYPES.Identifier ? null : fixer => fixer.replaceText(classElement.key, suggestedName),
                });
            };

            if (incorrectOnChangeRegExp.test(methodName)) {
                const suggestedName = methodName.replace(incorrectOnChangeRegExp, (_, eventName) => `on${eventName[0].toUpperCase()}${eventName.slice(1)}Change`);
                reportError("reactComponentChangeHandlerNaming", suggestedName);
            } else if (incorrectOnClickRegExp.test(methodName)) {
                const suggestedName = methodName.replace(incorrectOnClickRegExp, (_, eventName) => `on${eventName[0].toUpperCase()}${eventName.slice(1)}Click`);
                reportError("reactComponentClickHandlerNaming", suggestedName);
            }
        }
    });
}
