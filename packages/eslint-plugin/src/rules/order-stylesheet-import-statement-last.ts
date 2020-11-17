import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "orderStylesheetImportStatementLast";

export const name = "order-stylesheet-import-statement-last";

// TODO/Jamyth: Implement rule "order-stylesheet-import-statement-last"
// 1) Add a descriptive message to `meta.messages.orderStylesheetImportStatementLast`
// 2) Report error by calling `context.report` in visitor function
// 3) Add fixer when calling `context.report` (Remove the incorrectly ordered import statement, append it after the last import statement)
//    Note that you can "mutate" the source code multiple times by returning an array of `fixer` calls.
//    See "module-class-method-decorators" for reference.
// 4) Make sure the test case passes (Or update the test cases if necessary); see `order-stylesheet-import-statement-last.test.ts`
// 5) Remove these comments
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
