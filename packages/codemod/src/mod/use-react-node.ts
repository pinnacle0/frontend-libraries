import type {Transform} from "../type";

export const description = `Replace all SafeReactChild and SafeReactChildren with Reaet.ReactNode. Please type check again after transform`;

export const transform: Transform = function (source, toolkit) {
    const ast = toolkit.parse(source);
    const b = toolkit.builders;

    const oldType = ["SafeReactChildren", "SafeReactChild"];
    toolkit.visit(ast, {
        visitImportDeclaration(path) {
            if (
                path.node.source.type === "StringLiteral" &&
                path.node.source.value === "react" &&
                path.node.specifiers &&
                path.node.specifiers.findIndex(_ => _.type === "ImportDefaultSpecifier") === -1
            ) {
                const specifiers = path.node.specifiers ?? [];
                specifiers.unshift(
                    b.importDefaultSpecifier.from({
                        local: b.identifier("React"),
                    })
                );
                path.node.specifiers = specifiers;
            }
            this.traverse(path);
        },
        visitImportSpecifier(path) {
            if (path.node.imported.type === "Identifier" && oldType.includes(path.node.imported.name)) {
                if (path.parent.node.type === "ImportDeclaration" && path.parent.node.specifiers.length === 1) {
                    path.parent.replace();
                } else {
                    path.replace();
                }
            }
            this.traverse(path);
        },
        visitTSTypeReference(path) {
            if (path.node.typeName.type === "Identifier" && oldType.includes(path.node.typeName.name)) {
                path.replace(
                    b.tsQualifiedName.from({
                        left: b.identifier("React"),
                        right: b.identifier("ReactNode"),
                    })
                );
            }
            this.traverse(path);
        },
    });

    return toolkit.generate(ast).code;
};
