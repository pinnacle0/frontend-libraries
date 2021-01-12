import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/deep-nested-relative-imports";
import {name, rule} from "../../src/rules/deep-nested-relative-imports";
import {createConfig} from "../create-config";

const messageId: MessageIds = "deepNestedRelativeImports";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `import {actions} from "module/game/interactive";`,
        `import SiblingComponent from "./SiblingComponent";`,
        `import NestedComponent from "../NestedComponent";`,
        `import ShallowNestedComponent from "../../ShallowNestedComponent";`,
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `import DeepNestedComponent from "../../../DeepNestedComponent";`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `import VeryDeepNestedComponent from "../../../../VeryDeepNestedComponent";`,
            errors: [{line: 1, messageId}],
        },
    ],
});
