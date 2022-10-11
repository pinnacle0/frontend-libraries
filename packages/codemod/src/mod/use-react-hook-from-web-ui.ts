import type {NodePath} from "@babel/traverse";
import type {ImportDeclaration} from "@babel/types";
import type {Transform} from "../type";

/**
 * Since @pinnacle0/util@1.1.4 moved all react hooks to @pinnacle0/web-ui
 * This mod aim at refactoring the usages of all hooks imported from @pinnacle0/util
 */

const hookName = ["useDidMountEffect", "useWillUnmountEffect", "useAPI", "useBool", "useForceUpdate", "useSwipe", "usePrevious", "useThunk", "useTransform", "useWhyDidYouUpdate"];

const transform: Transform = function (source, api) {
    const ast = api.parse(source);
    const b = api.builder;

    let utilImport: NodePath<ImportDeclaration> | undefined;
    let usedWebUIHookImport: NodePath<ImportDeclaration> | undefined;
    api.traverse(ast, {
        ImportDeclaration(declaration) {
            if (declaration.node.importKind === "value") {
                if (declaration.node.source.value === "@pinnacle0/util" && declaration.node.specifiers && declaration.node.specifiers.length > 0) {
                    utilImport = declaration;
                } else if (declaration.node.source.value === "@pinnacle0/web-ui/hooks") {
                    usedWebUIHookImport = declaration;
                }
            }
        },
    });

    if (!utilImport) return;

    const webUIHookImportNode = usedWebUIHookImport ? usedWebUIHookImport.node : b.importDeclaration([], b.stringLiteral("@pinnacle0/web-ui/hooks"));

    api.traverse(
        utilImport.node,
        {
            ImportSpecifier(specifier) {
                if (specifier.node.imported.type === "Identifier" && hookName.includes(specifier.node.imported.name)) {
                    const newSpecifier = b.importSpecifier(b.identifier(specifier.node.imported.name), b.identifier(specifier.node.imported.name));
                    webUIHookImportNode.specifiers ? webUIHookImportNode.specifiers.push(newSpecifier) : (webUIHookImportNode.specifiers = [newSpecifier]);
                    specifier.remove();
                }
            },
        },
        utilImport.scope
    );

    if (!usedWebUIHookImport && webUIHookImportNode.specifiers.length >= 1) {
        utilImport.insertAfter(webUIHookImportNode);
    }

    if (utilImport.node.specifiers.length === 0) {
        utilImport.remove();
    }

    return api.generate(ast).code;
};

export default transform;
