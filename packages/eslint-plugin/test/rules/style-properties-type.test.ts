import {RuleTester} from "@typescript-eslint/rule-tester";
import type {MessageIds} from "../../src/rules/style-properties-type";
import {name, rule} from "../../src/rules/style-properties-type";
import {createConfig} from "../create-config";

const messageId: MessageIds = "stylePropertiesType";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `const TestComponent:React.ComponentType = () => {const testStyle: React.CSSProperties = {}; return null;}`,
        `const TEST_STYLE: React.CSSProperties = {}`,
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `const TestComponent:React.ComponentType = () => {const shouldEnd: React.CSSProperties = {};}`,
            errors: [{line: 1, messageId}],
            output: "const TestComponent:React.ComponentType = () => {const shouldEndStyle: React.CSSProperties = {};}",
        },
    ],
});
