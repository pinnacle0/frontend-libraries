import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/no-unnecessary-ending-index";
import {name, rule} from "../../src/rules/no-unnecessary-ending-index";
import {createConfig} from "../create-config";

const messageId: MessageIds = "noUnnecessaryEndingIndex";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `import {actions} from "module/main";`,
        `import "./index.less";`,
        `import "./index";`,
        `import "../index";`,
        `import "../../index";`,
        `import "../../../../../../../index";`,
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `import {actions} from "../UtilModule/index";`,
            errors: [{line: 1, messageId}],
            output: `import {actions} from "../UtilModule";`,
        },
        {
            code: `import {actions} from "module/main/index";`,
            errors: [{line: 1, messageId}],
            output: `import {actions} from "module/main";`,
        },
    ],
});
