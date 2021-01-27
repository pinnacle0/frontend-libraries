import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/variable-declaration-module-identifier-shadowing";
import {name, rule} from "../../src/rules/variable-declaration-module-identifier-shadowing";
import {createConfig} from "../create-config";

const messageId: MessageIds = "variableDeclarationModuleIdentifierShadowing";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `var foo, bar, baz;
        let moodle = 'a', poodle = 'b';
        const modules = {};`,
        `import {module as anotherName} from 'some-package';
        `,
        `// TypeScript declarations should not error
        declare var module: any;
        `,
        `// TypeScript declarations should not error
        declare var module: any;
        declare let module: any;
        declare const module: Record<string, any>;
        `,
        `// TypeScript type imports should not error
        import type module from 'some-package';
        import type {module} from 'some-package';
        `,
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
        {
            code: `
                declare var module: any;
                var module = "error on line 3 only";
                module = {};
            `,
            errors: [{line: 3, messageId}],
        },
        {
            code: `
                import * as _ from 'lodash';
                import module from 'some-package';
            `,
            errors: [{line: 3, messageId}],
        },
        {
            code: `
                import * as R from 'rambda';
                import {module} from 'some-package';
            `,
            errors: [{line: 3, messageId}],
        },
    ],
});
