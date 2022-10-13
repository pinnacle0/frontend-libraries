import type {NodePath, Transform} from "../type";
import {namedTypes} from "ast-types";
import ImportDeclaration = namedTypes.ImportDeclaration;

export const description = `
Since @pinnacle0/util@1.1.4 ReactUtil is moved to @pinnacle0/web-ui/util/ReactUtil
This codemod is aim at refactoring the usages of "ReactUtil" imported from @pinnacle0/util
`;

const transform: Transform = (source, toolkit) => {
    const ast = toolkit.parse(source);
    const b = toolkit.builders;
    let changed = false;

    let importDeclaration: NodePath<ImportDeclaration> | undefined;
    toolkit.visit(ast, {
        visitImportDeclaration(declaration) {
            if (declaration.node.source.value === "@pinnacle0/util" && declaration.node.importKind === "value" && declaration.node.specifiers && declaration.node.specifiers.length > 0) {
                importDeclaration = declaration;
            }
            this.traverse(declaration);
        },
    });

    if (importDeclaration === undefined) return;

    toolkit.visit(importDeclaration.node, {
        visitImportSpecifier(specifier) {
            if (specifier.node.imported.type === "Identifier" && specifier.node.imported.name === "ReactUtil") {
                importDeclaration!.insertAfter(b.importDeclaration([b.importSpecifier(b.identifier("ReactUtil"), b.identifier("ReactUtil"))], b.stringLiteral("@pinnacle0/web-ui/util/ReactUtil")));
                specifier.replace();
                changed = true;
            }
            this.traverse(specifier);
        },
    });

    if (importDeclaration.node.specifiers?.length === 0) {
        importDeclaration.replace();
    }

    return changed ? toolkit.generate(ast).code : undefined;
};

export default transform;
