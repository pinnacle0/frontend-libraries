import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/variable-declaration-module-identifier-shadowing";
import {createConfig} from "../create-config";

const messageId: MessageIds = "variableDeclarationModuleIdentifierShadowing";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `var foo, bar, baz;
        let moodle = 'a', poodle = 'b';
        const modules = {};`,
    ],
    invalid: [
        {
            code: `const module = new CoreFeatureModule("core-feature", initialState)`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `
                const notModule = {},
                module = {},
                alsoNotModule = {};
            `,
            errors: [{line: 3, messageId}],
        },
        {
            code: `
                var module;
                module = {};
            `,
            errors: [{line: 2, messageId}],
        },
    ],
});
