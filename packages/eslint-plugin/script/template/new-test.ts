import {RuleTester} from "@typescript-eslint/rule-tester";
import {type MessageIds, name, rule} from "../../src/rules/// {{KEBAB_CASE_RULE_NAME}}.js";
import {createConfig} from "../create-config.js";

const messageId: MessageIds = "// {{CAMEL_CASE_RULE_NAME}}";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `TODO__VALID_CODE`,
    ],
    invalid: [
        {
            code: `TODO__INVALID_CODE`,
            errors: [{line: 1, messageId}],
        },
    ],
});
