import type {FileInfo, API} from "jscodeshift";

/**
 * Since @pinnacle0/web-ui@0.3.63, ReactUil is moved from @pinnacle0/util to @pinnacle0/web-ui
 * This code mod aim at refactoring usages of ReactUil
 */

export default function (fileInfo: FileInfo, api: API) {
    const j = api.jscodeshift;
    const source = j(fileInfo.source);
    const oldUtilImport = source.find(j.ImportDeclaration, declaration => declaration.source.type === "StringLiteral" && declaration.source.value === "@pinnacle0/util");

    if (oldUtilImport.length < 1) {
        return source.toSource();
    }

    oldUtilImport.forEach(path => {
        const specifiers = j(path).find(j.ImportSpecifier);
        if (!specifiers) {
            return;
        }

        const targetSpecifier = specifiers.filter(path => path.value.imported.type === "Identifier" && path.value.imported.name === "ReactUtil");

        if (targetSpecifier.length !== 1) {
            return;
        }

        if (specifiers.length <= 1) {
            j(path)
                .find(j.StringLiteral)
                .forEach(_ => _.replace(j.stringLiteral("@pinnacle0/web-ui/util/ReactUtil")));
        } else {
            targetSpecifier.forEach(_ => _.replace());
            path.insertAfter(
                j.importDeclaration.from({
                    importKind: "value",
                    source: j.stringLiteral("@pinnacle0/web-ui/util/ReactUtil"),
                    specifiers: [j.importSpecifier(j.identifier("ReactUtil"))],
                })
            );
        }
    });

    return source.toSource();
}

export const parser = "tsx";
