import {ASTUtils, AST_NODE_TYPES, ESLintUtils} from "@typescript-eslint/utils";
import type {TSESLint, TSESTree} from "@typescript-eslint/utils";
import {isReactComponent} from "../util/isReactComponent.js";

export type Options = [];

export type MessageIds = "incorrectDefaultPropsTypeAnnotation" | "incorrectPickOrPickOptionalTypeArguments";

export const name = "react-component-default-props-typing";

export const rule = ESLintUtils.RuleCreator(_ => name)<Options, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Declare defaultProps with type Pick<Props> or PickOptional<Props>",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            incorrectDefaultPropsTypeAnnotation: "Annotate defaultProps with Pick/PickOptional of Props",
            incorrectPickOrPickOptionalTypeArguments: "Generic {{pickNodeRawName}} of defaultProps expects {{typeArgsExpected}} but received {{typeArgsReceived}}",
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
    const classBody: TSESTree.ClassBody = classNode.body;
    classBody.body.forEach(_ => {
        const defaultPropsNode = _.type === AST_NODE_TYPES.PropertyDefinition && ASTUtils.isIdentifier(_.key) && _.key.name === "defaultProps" && _.static && !_.declare ? _ : null;
        if (defaultPropsNode === null) {
            return;
        }
        const typeRef: TSESTree.TSTypeReference | null =
            defaultPropsNode.typeAnnotation?.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference ? defaultPropsNode.typeAnnotation.typeAnnotation : null;
        const pickNodeRawName: string | null = typeRef?.typeName.type === AST_NODE_TYPES.Identifier ? typeRef.typeName.name : null;
        const pickNodeTypeParamsLength = typeRef?.typeArguments?.params?.length || 0;

        if (!(pickNodeRawName === "Pick" || pickNodeRawName === "PickOptional")) {
            context.report({
                messageId: "incorrectDefaultPropsTypeAnnotation",
                node: defaultPropsNode,
            });
        } else if (!((pickNodeRawName === "Pick" && pickNodeTypeParamsLength === 2) || (pickNodeRawName === "PickOptional" && pickNodeTypeParamsLength === 1))) {
            context.report({
                messageId: "incorrectPickOrPickOptionalTypeArguments",
                node: defaultPropsNode,
                data: {
                    pickNodeRawName,
                    typeArgsExpected: pickNodeRawName === "Pick" ? "2 type arguments" : "1 type argument",
                    typeArgsReceived: `${pickNodeTypeParamsLength} ${typeRef ? `(${context.sourceCode.getText(typeRef)})` : ""}`,
                },
            });
        }
    });
}
