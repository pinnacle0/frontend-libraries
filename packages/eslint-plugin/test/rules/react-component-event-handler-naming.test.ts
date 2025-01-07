import {RuleTester} from "@typescript-eslint/rule-tester";
import type {MessageIds} from "../../src/rules/react-component-event-handler-naming.js";
import {name, rule} from "../../src/rules/react-component-event-handler-naming.js";
import {createConfig} from "../create-config.js";

const reactComponentChangeHandlerNamingId: MessageIds = "reactComponentChangeHandlerNaming";

const reactComponentClickHandlerNamingId: MessageIds = "reactComponentClickHandlerNaming";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        // onChange
        `class CorrectChangeHandlerNameComponent extends React.Component<Props> {
            onSomethingChange() {}
            onSomethingArrowChange = () => {};
            render() { return <div />; }
        }`,
        `class CorrectChangeHandlerNamePureComponent extends React.PureComponent<Props> {
            onSomethingChange() {}
            onSomethingArrowChange = () => {};
            render() { return <div />; }
        }`,
        // onClick
        `class CorrectClickHandlerNameComponent extends React.Component<Props> {
            onSomethingClick() {}
            onSomethingArrowClick = () => {};
            render() { return <div />; }
        }`,
        `class CorrectClickHandlerNamePureComponent extends React.PureComponent<Props> {
            onSomethingClick() {}
            onSomethingArrowClick = () => {};
            render() { return <div />; }
        }`,
        // onChange and onClick
        `class CorrectEventHandlerNameComponent extends React.Component<Props> {
            onSomethingClick() {}
            onSomethingArrowClick = () => {};
            onSomethingChange() {}
            onSomethingArrowChange = () => {};
            render() { return <div />; }
        }`,
    ],
    invalid: [
        // onChange
        {
            code: `
            class InorrectChangeHandlerNameComponent extends React.Component<Props> {
                onChangeSomething() {}
                onChangeSomethingArrow = () => {};
                onChangeArrowSomething = () => {};
                render() { return <div />; }
            }`,
            errors: [
                {line: 3, messageId: reactComponentChangeHandlerNamingId},
                {line: 4, messageId: reactComponentChangeHandlerNamingId},
                {line: 5, messageId: reactComponentChangeHandlerNamingId},
            ],
            output: `
            class InorrectChangeHandlerNameComponent extends React.Component<Props> {
                onSomethingChange() {}
                onSomethingArrowChange = () => {};
                onArrowSomethingChange = () => {};
                render() { return <div />; }
            }`,
        },
        // onClick
        {
            code: `
            class InorrectClickHandlerNameComponent extends React.Component<Props> {
                onClickSomething() {}
                onClickSomethingArrow = () => {};
                onClickArrowSomething = () => {};
                render() { return <div />; }
            }`,
            errors: [
                {line: 3, messageId: reactComponentClickHandlerNamingId},
                {line: 4, messageId: reactComponentClickHandlerNamingId},
                {line: 5, messageId: reactComponentClickHandlerNamingId},
            ],
            output: `
            class InorrectClickHandlerNameComponent extends React.Component<Props> {
                onSomethingClick() {}
                onSomethingArrowClick = () => {};
                onArrowSomethingClick = () => {};
                render() { return <div />; }
            }`,
        },
        // onChange and onClick
        {
            code: `
            class InorrectEventHandlerNameComponent extends React.Component<Props> {
                onChangeSomething() {}
                onChangeSomethingArrow = () => {};
                onClickSomething() {}
                onClickArrowSomething = () => {};
                render() { return <div />; }
            }`,
            errors: [
                {line: 3, messageId: reactComponentChangeHandlerNamingId},
                {line: 4, messageId: reactComponentChangeHandlerNamingId},
                {line: 5, messageId: reactComponentClickHandlerNamingId},
                {line: 6, messageId: reactComponentClickHandlerNamingId},
            ],
            output: `
            class InorrectEventHandlerNameComponent extends React.Component<Props> {
                onSomethingChange() {}
                onSomethingArrowChange = () => {};
                onSomethingClick() {}
                onArrowSomethingClick = () => {};
                render() { return <div />; }
            }`,
        },
    ],
});
