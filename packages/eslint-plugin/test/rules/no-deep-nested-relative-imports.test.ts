import {RuleTester} from "@typescript-eslint/rule-tester";
import type {MessageIds} from "../../src/rules/no-deep-nested-relative-imports.js";
import {name, rule} from "../../src/rules/no-deep-nested-relative-imports.js";
import {createConfig} from "../create-config.js";

const messageId: MessageIds = "noDeepNestedRelativeImports";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `import {actions} from "module/game/interactive";`,
        `import SiblingComponent from "./SiblingComponent";`,
        `import NestedComponent from "../NestedComponent";`,
        `import ShallowNestedComponent from "../../ShallowNestedComponent";`,
        // biome-ignore lint: preserve
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
