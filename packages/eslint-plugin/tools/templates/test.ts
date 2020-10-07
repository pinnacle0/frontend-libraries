import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/{2}";
import {createConfig} from "../create-config";

const messageId: MessageIds = "{1}";

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
