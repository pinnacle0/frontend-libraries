import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/react-component-display-name";
import {createConfig} from "../create-config";

const noDisplayNameId: MessageIds = "noDisplayName";
const displayNameMismatchId: MessageIds = "displayNameMismatch";
const staticDisplayNameId: MessageIds = "staticDisplayName";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `export class Button extends React.Component<Props> {
            static displayName = "Button";

            render() {
                return <div></div>;
            }
        }`,
        `class Card extends React.PureComponent<Props> {
            static displayName = "Card";

            render() {
                return <div />;
            }
        }`,
        `export const Component = ReactUtil.memo("Component", () => {})`,
    ],
    invalid: [
        {
            code: `
            export class Button extends React.Component<Props> {
                render() {
                    return <div />;
                }
            }`,
            errors: [{line: 2, messageId: noDisplayNameId}],
            output: `
            export class Button extends React.Component<Props> {
static displayName = "Button";

                render() {
                    return <div />;
                }
            }`,
        },
        {
            code: `
            export class Main extends React.PureComponent<Props> {
                static displayName = "CommonModuleMain";
                render() {
                    return <View />;
                }
            }`,
            errors: [{line: 3, messageId: displayNameMismatchId}],
            output: `
            export class Main extends React.PureComponent<Props> {
                static displayName = "Main";
                render() {
                    return <View />;
                }
            }`,
        },
        {
            code: `
            class Text extends React.PureComponent<Props> {
                displayName = "Text";
                render() {
                    return <Text>{this.props.children}</Text>;
                }
            }`,
            errors: [{line: 3, messageId: staticDisplayNameId}],
            output: `
            class Text extends React.PureComponent<Props> {
                static displayName = "Text";
                render() {
                    return <Text>{this.props.children}</Text>;
                }
            }`,
        },
        {
            code: `const Component = ReactUtil.memo("WrongName", () => {})`,
            output: `const Component = ReactUtil.memo("Component", () => {})`,
            errors: [{line: 1, messageId: displayNameMismatchId}],
        },
    ],
});
