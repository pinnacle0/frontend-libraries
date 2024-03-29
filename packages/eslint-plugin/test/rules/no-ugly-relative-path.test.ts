import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/no-ugly-relative-path";
import {name, rule} from "../../src/rules/no-ugly-relative-path";
import {createConfig} from "../create-config";

const messageId: MessageIds = "noUglyRelativePath";

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
            code: `
            import DefaultImport from ".";
            import DefaultImport from "./";
            import DefaultImport from "..";
            import DefaultImport from "../";
            import DefaultImport from "../..";
            import DefaultImport from "../../";`,
            errors: [
                {line: 2, messageId},
                {line: 3, messageId},
                {line: 4, messageId},
                {line: 5, messageId},
                {line: 6, messageId},
                {line: 7, messageId},
            ],
            output: `
            import DefaultImport from "./index";
            import DefaultImport from "./index";
            import DefaultImport from "../index";
            import DefaultImport from "../index";
            import DefaultImport from "../../index";
            import DefaultImport from "../../index";`,
        },
        {
            code: `
            import DefaultImport from "../../..";
            import DefaultImport from "../../../";`,
            errors: [
                {line: 2, messageId},
                {line: 3, messageId},
            ],
        },
    ],
});
