import {RuleTester} from "@typescript-eslint/rule-tester";
import {createConfig} from "../create-config";
import {name, rule} from "../../src/rules/type-import-outside-curly-braces";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `
        import React from "react";
        import type {ButtonProps} from "./type";
        `,
        `
        import React from "react";
        import {classNames, type ReactNode} from "core-fe";
        import type {SafeChild} from "@pinnacle0/util";
        import type {ButtonProps} from "./type";
        `,
    ],
    invalid: [
        {
            code: `
            import React from "react";
            import {type ButtonProps} from "./type";
            `,
            errors: [{line: 3, messageId: "typeImportOutsideBracket"}],
            output: `
            import React from "react";
            import type {ButtonProps} from "./type";
            `,
        },
        {
            code: `
            import React from "react";
            import {classNames, type ReactNode} from "core-fe";
            import {type SafeChild} from "@pinnacle0/util";
            `,
            errors: [{line: 4, messageId: "typeImportOutsideBracket"}],
            output: `
            import React from "react";
            import {classNames, type ReactNode} from "core-fe";
            import type {SafeChild} from "@pinnacle0/util";
            `,
        },
        {
            code: `
            import React from "react";
            import {type ButtonProps} from "./type";
            import {type AnotherProps} from "../type";
            `,
            errors: [
                {line: 3, messageId: "typeImportOutsideBracket"},
                {line: 4, messageId: "typeImportOutsideBracket"},
            ],
            output: `
            import React from "react";
            import type {ButtonProps} from "./type";
            import type {AnotherProps} from "../type";
            `,
        },
        {
            code: `
            import React from "react";
            import {type AnotherProps, type ThirdProps} from "../type";
            `,
            errors: [{line: 3, messageId: "typeImportOutsideBracket"}],
            output: `
            import React from "react";
            import type {AnotherProps, ThirdProps} from "../type";
            `,
        },
    ],
});
