import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/ugly-relative-path";
import {createConfig} from "../create-config";

const messageId: MessageIds = "uglyRelativePath";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `import {actions} from "module/game/interactive";`,
        `import {Button} from "antd";`,
        `import DefaultImport from "./index";`,
        `import {NamedImport} from "../index";`,
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `import DefaultImport from ".";`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `import {NamedImport} from "..";`,
            errors: [{line: 1, messageId}],
        },
    ],
});
