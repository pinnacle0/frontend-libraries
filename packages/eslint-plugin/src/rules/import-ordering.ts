import {ESLintUtils} from "@typescript-eslint/utils";
import {ImportSorter} from "../util/ImportSorter.js";
import type {MessageIds} from "../util/ImportSorter.js";

export const name = "import-ordering";

export const rule = ESLintUtils.RuleCreator(_ => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "Check import order according to import type and path",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            importOrdering: "`{{ currentNode }}` should be place after `{{ prevNodeInRightOrder }}`",
            importOrderingLast: "`{{ currentNode }}` should be the last of all imports",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        const sorter = new ImportSorter(context);
        return {
            ImportDeclaration(node) {
                sorter.register(node);
            },
            "Program:exit": () => {
                sorter.report();
                sorter.clear();
            },
        };
    },
});
