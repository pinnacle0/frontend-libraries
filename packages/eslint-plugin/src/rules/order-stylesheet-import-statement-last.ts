import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "orderStylesheetImportStatementLast";

export const name = "order-stylesheet-import-statement-last";

export const rule = ESLintUtils.RuleCreator(name => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            orderStylesheetImportStatementLast: "",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {};
    },
});
