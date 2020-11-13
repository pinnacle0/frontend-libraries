import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "// {{KEBAB_CASE_RULE_NAME}}";

export const name = "// {{CAMEL_CASE_RULE_NAME}}";

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
            // {{KEBAB_CASE_RULE_NAME}}: "",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {};
    },
});
