import type {FileInfo, API} from "jscodeshift";

/**
 * {Explain briefly what this codemod is going to do}
 */

export default function (fileInfo: FileInfo, api: API) {
    const j = api.jscodeshift;
    const source = j(fileInfo.source);

    const importDeclaration = source
        .find(j.ImportDeclaration, declaration => declaration.source.type === "StringLiteral" && declaration.source.value === "@pinnacle0/util" && declaration.importKind === "value")
        .filter(declaration =>
            j(declaration)
                .find(j.ImportSpecifier)
                .some(specifier => specifier.value.imported.type === "Identifier" && specifier.value.imported.name === "ReactUtil")
        );

    if (importDeclaration.length < 1) {
        return source.toSource();
    }

    const newImport = j.importDeclaration.from({
        specifiers: [
            j.importSpecifier.from({
                imported: j.identifier("ReactUtil"),
            }),
        ],
        source: j.stringLiteral("@pinnacle0/web-ui/util/ReactUtil"),
    });

    importDeclaration.forEach(declaration => {
        if (declaration.value.specifiers!.length === 1) {
            declaration.replace(newImport);
        } else {
            j(declaration)
                .find(j.ImportSpecifier, specifier => specifier.imported.type === "Identifier" && specifier.imported.name === "ReactUtil")
                .forEach(_ => _.replace());
            declaration.insertAfter(newImport);
        }
    });

    return source.toSource();
}

export const parser = "tsx";
