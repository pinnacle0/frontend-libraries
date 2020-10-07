import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/no-named-imports";
import {createConfig} from "../create-config";

const messageId: MessageIds = "noNamedImports";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        {code: `import React from "react";`, options: ["react", "react-dom"]},
        {code: `import ReactDOM from "react-dom";`, options: ["react", "react-dom"]},
        {code: `import ADefaultSymbol, {ANamedSymbol} from "a-node-module";`, options: ["react", "react-dom"]},
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `import React, {useState} from "react";`,
            options: ["react"],
            errors: [{line: 1, messageId}],
        },
        {
            code: `import {render} from "react-dom";`,
            options: ["react-dom"],
            errors: [{line: 1, messageId}],
        },
    ],
});
