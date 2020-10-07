import {ASTUtils, AST_NODE_TYPES, TSESTree} from "@typescript-eslint/experimental-utils";
import {RuleContext} from "@typescript-eslint/experimental-utils/dist/ts-eslint/Rule";

export function isCoreFeOrCoreNativeModuleClass<MessageIds extends string, Options extends readonly unknown[]>(
    context: Readonly<RuleContext<MessageIds, Options>>,
    classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression
) {
    const {superClass} = classNode;
    const isClassNodeExtendsModule = superClass?.type === AST_NODE_TYPES.Identifier && superClass.name === "Module";
    if (isClassNodeExtendsModule) {
        const allModuleVariableDefinitions = ASTUtils.findVariable(context.getScope(), "Module")?.defs || [];
        for (const _ of allModuleVariableDefinitions) {
            if (
                _ &&
                _.type === "ImportBinding" &&
                _.parent.type === AST_NODE_TYPES.ImportDeclaration &&
                _.parent.source.type === AST_NODE_TYPES.Literal &&
                typeof _.parent.source.value === "string" &&
                ["core-fe", "core-native"].includes(_.parent.source.value)
            ) {
                return true;
            }
        }
    }
    return false;
}
