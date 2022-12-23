import type {NodePath, Transform} from "../type";
import type {namedTypes} from "ast-types";

export const description = `
Since core-fe/1.33.6-beta.1 all react-redux hooks are moved to core-fe
This mod aim at refactoring the usages of all hooks imported from core-fe
`;

const hooks = ["useStore", "useDispatch", "useSelector"];

export const transform: Transform = (source, toolkit) => {
    const importedHooks: string[] = [];
    const ast = toolkit.parse(source);
    const b = toolkit.builders;
    let changed = false;
    let reactReduxImportDeclaration: NodePath<namedTypes.ImportDeclaration> | undefined;
    let coreFeImportDeclaration: NodePath<namedTypes.ImportDeclaration> | undefined;

    toolkit.visit(ast, {
        visitImportDeclaration(path) {
            const node = path.node;
            if (node.source.value === "react-redux" && node.importKind === "value" && node.specifiers && node.specifiers.length > 0) {
                reactReduxImportDeclaration = path;
            }
            this.traverse(path);
        },
    });

    if (!reactReduxImportDeclaration) {
        return;
    }

    toolkit.visit(ast, {
        visitImportDeclaration(path) {
            const node = path.node;
            if (node.source.value === "core-fe" && node.specifiers && node.specifiers.length > 0) {
                coreFeImportDeclaration = path;
            }
            this.traverse(path);
        },
    });

    toolkit.visit(reactReduxImportDeclaration.node, {
        visitImportSpecifier(path) {
            const node = path.node;
            if (hooks.includes(node.imported.name)) {
                importedHooks.push(node.imported.name);
                path.replace();
            }
            this.traverse(path);
        },
    });

    if (importedHooks.length > 0) {
        const importSpecifiers = importedHooks.map(hook => b.importSpecifier(b.identifier(hook)));
        if (coreFeImportDeclaration) {
            importSpecifiers.forEach(_ => coreFeImportDeclaration && coreFeImportDeclaration.node.specifiers?.push(_));
        } else {
            reactReduxImportDeclaration?.insertAfter(b.importDeclaration(importSpecifiers, b.stringLiteral("core-fe")));
        }
        changed = true;
    }

    if (reactReduxImportDeclaration.node.specifiers?.length === 0) {
        reactReduxImportDeclaration.replace();
    }

    return changed ? toolkit.generate(ast).code : undefined;
};
