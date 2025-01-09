import {RuleTester} from "@typescript-eslint/rule-tester";
import type {MessageIds} from "../../src/rules/no-named-imports.js";
import {name, rule} from "../../src/rules/no-named-imports.js";
import {createConfig} from "../create-config.js";

const messageId: MessageIds = "noNamedImports";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        {code: `import React from "react";`, options: [["react", "react-dom"]]},
        {code: `import ReactDOM from "react-dom";`, options: [["react", "react-dom"]]},
        {code: `import ADefaultSymbol, {ANamedSymbol} from "a-node-module";`, options: [["react", "react-dom"]]},
        {code: `import React, {useState} from "react";`, options: [["lodash"]]},
        {code: `import React, {useState} from "react";`, options: [[]]},
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `import React, {useState} from "react";`,
            options: [["react"]],
            errors: [{line: 1, messageId}],
        },
        {
            code: `import {render} from "react-dom";`,
            options: [["react-dom"]],
            errors: [{line: 1, messageId}],
        },
        {
            code: `
            import React, {useState} from "react";
            import {render} from "react-dom";`,
            errors: [
                {line: 2, messageId},
                {line: 3, messageId},
            ],
        },
        {
            code: `
            import {get} from "lodash";
            import React, {useState} from "react";`,
            options: [["lodash"]],
            errors: [{line: 2, messageId}],
        },
    ],
});
