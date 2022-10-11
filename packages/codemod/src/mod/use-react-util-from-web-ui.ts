import type {NodePath} from "@babel/traverse";
import type {ImportDeclaration} from "@babel/types";
import type {Transform} from "../type";

export const description = `
Since @pinnacle0/util@1.1.4 ReactUtil is moved to @pinnacle0/web-ui/util/ReactUtil
This codemod is aim at refactoring the usages of "ReactUtil" imported from @pinnacle0/util
`;

const transform: Transform = (source, api) => {
    const ast = api.parse(source);
    const b = api.builder;

    let importDeclaration: NodePath<ImportDeclaration> | undefined;
    api.traverse(ast, {
        ImportDeclaration(declaration) {
            if (declaration.node.source.value === "@pinnacle0/util" && declaration.node.importKind === "value" && declaration.node.specifiers && declaration.node.specifiers.length > 0) {
                importDeclaration = declaration;
            }
        },
    });

    if (importDeclaration === undefined) return;

    api.traverse(
        importDeclaration.node,
        {
            ImportSpecifier(specifier) {
                if (specifier.node.imported.type === "Identifier" && specifier.node.imported.name === "ReactUtil") {
                    importDeclaration!.insertAfter(b.importDeclaration([b.importSpecifier(b.identifier("ReactUtil"), b.identifier("ReactUtil"))], b.stringLiteral("@pinnacle0/web-ui/util/ReactUtil")));
                    specifier.remove();
                }
            },
        },
        importDeclaration.scope
    );

    if (importDeclaration.node.specifiers.length === 0) {
        importDeclaration.remove();
    }

    return api.generate(ast).code;
};

export default transform;
