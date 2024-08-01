import type {TSESTree, TSESLint} from "@typescript-eslint/utils";
import {ASTUtils, AST_NODE_TYPES} from "@typescript-eslint/utils";

export function isCoreFeOrCoreNativeModuleClass<MessageIds extends string, Options extends readonly unknown[]>(
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    classNode: TSESTree.ClassDeclaration | TSESTree.ClassExpression
) {
    const {superClass} = classNode;
    const isClassNodeExtendsModule = superClass?.type === AST_NODE_TYPES.Identifier && superClass.name === "Module";
    if (isClassNodeExtendsModule) {
        const allModuleVariableDefinitions = ASTUtils.findVariable(context.sourceCode.getScope(superClass), "Module")?.defs || [];
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
