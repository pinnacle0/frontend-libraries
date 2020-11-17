import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/order-stylesheet-import-statement-last";
import {createConfig} from "../create-config";

const messageId: MessageIds = "orderStylesheetImportStatementLast";

const ruleTester = new TSESLint.RuleTester(createConfig());

// TODO/Jamyth: Make sure tests passes for rule "order-stylesheet-import-statement-last"
// To run this test file individually in watch mode (without running other test files), use the following command:
// ```sh
// $ cd packages/eslint-plugin/
// $ yarn jest test/rules/order-stylesheet-import-statement-last.test.ts --config config/jest.config.js --watch
// ```
//
// 1) Add/remove `valid` and `invalid` test cases if you think they do not describe the behaviour of this lint rule.
// 2) Note that fixers are **whitespace-sensitive** so I dedented the code snippets so it is easier to create the fixer.
// 3) Remove these comments
ruleTester.run(name, rule, {
    valid: [
        `import React from "react";
        import AntButton from "antd/lib/Button";
        import {SomethingUtil} from "../util/SomethingUtil";`,

        `import {Button} from "@pinnacle0/web-ui/core/Button";
        import {actions} from "../index";
        import React from "react";
        import "./index.less";`,

        `import React from "react";
        import {Input} from "../form-components/Input";
        import "./index.less";`,

        `import React from "react";
        import AntButton from "antd/lib/Button";
        import "./index.less";
        import "antd/lib/Button/index.less";`,
    ],
    invalid: [
        {
            code: `
import "../index.less";
import {Filter} from "./Filter";
import React from "react";
`,
            errors: [{line: 3, messageId}],
            output: `
import {Filter} from "./Filter";
import React from "react";
import "../index.less";
`,
        },

        {
            code: `
import React from "react";
import "./index.less";
import AntButton from "antd/lib/Button";
import "antd/lib/Button/index.less";
`,
            errors: [{line: 3, messageId}],
            output: `
import React from "react";
import AntButton from "antd/lib/Button";
import "antd/lib/Button/index.less";
import "./index.less";
`,
        },
    ],
});
