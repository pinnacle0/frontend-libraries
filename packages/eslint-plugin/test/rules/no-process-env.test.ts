import {RuleTester} from "@typescript-eslint/rule-tester";
import {MessageIds, name, rule} from "../../src/rules/no-process-env.js";
import {createConfig} from "../create-config.js";

const messageId: MessageIds = "noProcessEnv";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `process.cwd()`,
        `name.process.cwd()`,
        `name.process.env.set.cwd()`,
        `function someFunction() {
            process.getuid()
        }`,
        `const a = 3`,
        `const propertyName = 'env';const env = process[propertyName]`,
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `process.env`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `process.env.NODE_ENV`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `function getMode(){
                if( process.env.NODE_ENV === "production") {
                    // do something
                }
            }`,
            errors: [{line: 2, messageId}],
        },
        {
            code: `process['env']`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `process['env']['NODE_ENV']`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `process.env.NODE_ENV.man_i_dont_know.long.long.long.long.long`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `const obj = {
                [process.env]: 3
            }`,
            errors: [{line: 2, messageId}],
        },
    ],
});
