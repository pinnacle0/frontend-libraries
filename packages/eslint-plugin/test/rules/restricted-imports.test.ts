import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/restricted-imports";
import {name, rule} from "../../src/rules/restricted-imports";
import {createConfig} from "../create-config";
import {testFilePath} from "../test-file-path";

const messageId: MessageIds = "restrictedImports";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        {
            code: `import React from "react";`,
            options: [{packages: ["antd", "moment"], path: "shared"}],
            filename: testFilePath("./shared/test.ts"),
        },
        {
            code: `import Input from "antd";`,
            options: [{packages: ["antd"], path: "shared"}],
            filename: testFilePath("./shared/test.ts"),
        },
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `import React from "antd";`,
            errors: [{line: 1, messageId}],
            filename: testFilePath("./module/test.ts"),
            options: [{packages: ["antd"], path: "shared"}],
        },
        {
            code: `import React from "antd";`,
            errors: [{line: 1, messageId}],
            filename: testFilePath("./notshared/test.ts"),
            options: [{packages: ["antd"], path: "shared"}],
        },
    ],
});
