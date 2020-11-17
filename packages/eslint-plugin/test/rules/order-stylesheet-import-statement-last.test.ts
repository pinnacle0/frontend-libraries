import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/order-stylesheet-import-statement-last";
import {createConfig} from "../create-config";

const messageId: MessageIds = "orderStylesheetImportStatementLast";

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
