import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/order-stylesheet-import-statement-last";
import {createConfig} from "../create-config";

const messageId: MessageIds = "orderStylesheetImportStatementLast";

const ruleTester = new TSESLint.RuleTester(createConfig());

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
