import {ESLintUtils} from "@typescript-eslint/utils";

export type MessageIds = "// {{CAMEL_CASE_RULE_NAME}}";

export const name = "// {{KEBAB_CASE_RULE_NAME}}";

export const rule = ESLintUtils.RuleCreator(_ => name)<[], MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: "",
        },
        hasSuggestions: true,
        fixable: "code",
        messages: {
            // {{CAMEL_CASE_RULE_NAME}}: "",
        },
        schema: [],
    },
    defaultOptions: [],
    create: context => {
        return {};
    },
});
