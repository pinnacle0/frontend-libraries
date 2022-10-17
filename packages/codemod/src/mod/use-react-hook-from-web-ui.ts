import type {namedTypes} from "ast-types";
import type {Transform} from "../type";
import type {NodePath} from "ast-types/lib/node-path";

const hookName = ["useDidMountEffect", "useWillUnmountEffect", "useAPI", "useBool", "useForceUpdate", "useSwipe", "usePrevious", "useThunk", "useTransform", "useWhyDidYouUpdate"];

export const description = `
Since @pinnacle0/util@1.1.4 all react hooks are moved to @pinnacle0/web-ui
This mod aim at refactoring the usages of all hooks imported from @pinnacle0/util
`;

export const transform: Transform = function (source, toolkit) {
    const ast = toolkit.parse(source);
    const b = toolkit.builders;

    let utilImport: NodePath<namedTypes.ImportDeclaration> | undefined;
    let usedWebUIHookImport: NodePath<namedTypes.ImportDeclaration> | undefined;

    toolkit.visit(ast, {
        visitImportDeclaration(declaration) {
            if (declaration.node.importKind === "value") {
                if (declaration.node.source.value === "@pinnacle0/util" && declaration.node.specifiers && declaration.node.specifiers.length > 0) {
                    utilImport = declaration;
                } else if (declaration.node.source.value === "@pinnacle0/web-ui/hooks") {
                    usedWebUIHookImport = declaration;
                }
            }
            this.traverse(declaration);
        },
    });

    if (!utilImport) return;

    const webUIHookImportNode = usedWebUIHookImport ? usedWebUIHookImport.node : b.importDeclaration([], b.stringLiteral("@pinnacle0/web-ui/hooks"));

    toolkit.visit(utilImport.node, {
        visitImportSpecifier(specifier) {
            if (specifier.node.imported.type === "Identifier" && hookName.includes(specifier.node.imported.name)) {
                const newSpecifier = b.importSpecifier.from({
                    imported: b.identifier(specifier.node.imported.name),
                    local: b.identifier(specifier.node.imported.name),
                });
                webUIHookImportNode.specifiers ? webUIHookImportNode.specifiers.push(newSpecifier) : (webUIHookImportNode.specifiers = [newSpecifier]);
                specifier.replace();
            }
            this.traverse(specifier);
        },
    });

    if (!usedWebUIHookImport && webUIHookImportNode.specifiers && webUIHookImportNode.specifiers.length >= 1) {
        utilImport.insertAfter(webUIHookImportNode);
    }

    if (utilImport.node.specifiers?.length === 0) {
        utilImport.replace();
    }

    return toolkit.generate(ast).code;
};
