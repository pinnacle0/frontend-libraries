import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/// {{KEBAB_CASE_RULE_NAME}}";
import {createConfig} from "../create-config";

const messageId: MessageIds = "// {{CAMEL_CASE_RULE_NAME}}";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `TODO__VALID_CODE`,
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `TODO__INVALID_CODE`,
            errors: [{line: 1, messageId}],
        },
    ],
});
