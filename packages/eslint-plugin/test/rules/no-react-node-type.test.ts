import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/no-react-node-type";
import {createConfig} from "../create-config";

const messageId: MessageIds = "noReactNodeType";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `interface Props {
            children: SafeReactChildren;
        }`,
        `interface HelloProps {
            hello: SafeReactChildren;
        }`,
        `interface ComponentProps {
            text: SafeReactChild;
        }`,
    ],
    invalid: [
        {
            code: `interface Props {
                children: React.ReactNode;
            }`,
            errors: [{line: 2, messageId}],
        },
        {
            code: `interface HelloProps {
                hello: React.ReactNode;
            }`,
            errors: [{line: 2, messageId}],
        },
        {
            code: `interface ComponentProps {
                text: React.ReactNode;
            }`,
            errors: [{line: 2, messageId}],
        },
        {
            code: `const JSX: React.ReactNode;`,
            errors: [{line: 1, messageId}],
        },
        {
            code: `const JSX: ReactNode;`,
            errors: [{line: 1, messageId}],
        },
    ],
});
