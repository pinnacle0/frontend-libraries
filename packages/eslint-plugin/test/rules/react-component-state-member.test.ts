import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/react-component-state-member";
import {name, rule} from "../../src/rules/react-component-state-member";
import {createConfig} from "../create-config";

const messageId: MessageIds = "reactComponentStateMember";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `class CorrectComponent extends React.Component<Props, State> {
            constructor(props: Props) {
                this.state = {foo: "bar"};
            }
        }`,
    ],
    invalid: [
        {
            code: `
            class IncorrectComponent extends React.Component<Props, State> {
                constructor(props: Props) {}
                state = {foo: "bar"};        // State field on line 4
            }`,
            errors: [{line: 4, messageId}],
            output: `
            class IncorrectComponent extends React.Component<Props, State> {
                constructor(props: Props) {this.state = {foo: "bar"};}
                        // State field on line 4
            }`,
        },
        {
            code: `
            class IncorrectComponentWithoutDeclaredProps extends React.Component {
                constructor(props) {}
                state = {foo: "bar"};        // State field on line 4
            }`,
            errors: [{line: 4, messageId}],
            output: `
            class IncorrectComponentWithoutDeclaredProps extends React.Component {
                constructor(props) {this.state = {foo: "bar"};}
                        // State field on line 4
            }`,
        },
        {
            code: `
            class IncorrectComponentWithoutConstructor extends React.Component<Props, State> {
                state = {foo: "bar"};        // State field on line 3
            }`,
            errors: [{line: 3, messageId}],
            output: `
            class IncorrectComponentWithoutConstructor extends React.Component<Props, State> {
                constructor(props: Props) {this.state = {foo: "bar"};}        // State field on line 3
            }`,
        },
        {
            code: `
            class IncorrectComponentWithoutConstructorAndDeclaredProps extends React.Component {
                state = {foo: "bar"};        // State field on line 3
            }`,
            errors: [{line: 3, messageId}],
            output: `
            class IncorrectComponentWithoutConstructorAndDeclaredProps extends React.Component {
                constructor(props) {this.state = {foo: "bar"};}        // State field on line 3
            }`,
        },
        {
            code: `
            class IncorrectComponentWithoutConstructor2Lines extends React.Component<Props, State> {
                state = {        // State field on line 3
                    foo: "bar",
                };
            }`,
            errors: [{line: 3, messageId}],
            output: `
            class IncorrectComponentWithoutConstructor2Lines extends React.Component<Props, State> {
                constructor(props: Props) {this.state = {        // State field on line 3
                    foo: "bar",
                };}
            }`,
        },
        {
            code: `
            class IncorrectComponentWithoutConstructorAndDeclaredProps2Lines extends React.Component {
                state = {        // State field on line 3
                    foo: "bar",
                };
            }`,
            errors: [{line: 3, messageId}],
            output: `
            class IncorrectComponentWithoutConstructorAndDeclaredProps2Lines extends React.Component {
                constructor(props) {this.state = {        // State field on line 3
                    foo: "bar",
                };}
            }`,
        },
    ],
});
