import {RuleTester} from "@typescript-eslint/rule-tester";
import type {MessageIds, MethodOrderChecker} from "../../src/rules/react-component-method-ordering";
import {name, rule, methodOrderCheckers} from "../../src/rules/react-component-method-ordering";
import {createConfig} from "../create-config";

const messageId: MessageIds = "reactComponentMethodOrdering";

const ruleTester = new RuleTester(createConfig());

describe("methodOrderCheckers can correctly identify method types", () => {
    function testMethodToBeType(methodName: string, expectedType: MethodOrderChecker["type"]) {
        test(`${methodName} is type ${expectedType}`, () => {
            expect(methodOrderCheckers.find(_ => _.validator(methodName))?.type).toEqual(expectedType);
        });
    }
    testMethodToBeType("componentDidMount", "lifecyle-method");
    testMethodToBeType("doSomething", "custom-function");
    testMethodToBeType("doSomethingArrow", "custom-function");
    testMethodToBeType("onSomeChange", "event-handler");
    testMethodToBeType("onSomeArrowChange", "event-handler");
    testMethodToBeType("renderHead", "custom-render-function");
    testMethodToBeType("renderBody", "custom-render-function");
    testMethodToBeType("render", "react-render-function");
});

ruleTester.run(name, rule, {
    valid: [
        `class CorrectOrderComponent extends React.PureComponent<Props> {
            componentDidMount() {}
            doSomething() {}
            doSomethingArrow = () => {};
            onSomeChange() {}
            onSomeArrowChange = () => {};
            renderHead = () => {};
            renderBody = () => {};
            render() { return <div />; }
        }`,
        `class CorrectOrderComponent extends React.PureComponent<Props> {
            static onSomeStaticChange() {}      // Order should be checked separately
            static renderStaticHead = () => {}; // Order should be checked separately
            componentDidMount() {}
            doSomething() {}
            doSomethingArrow = () => {};
            onSomeArrowChange = () => {};
            renderBody = () => {};
            render() { return <div />; }
        }`,
        `class CorrectOrderComponent extends React.PureComponent<Props> {
            private renderStaticHead = () => {}; // Order should be checked separately
            static onSomeStaticChange() {}       // Order should be checked separately
            componentDidMount() {}
            doSomething() {}
            doSomethingArrow = () => {};
            onSomeArrowChange = () => {};
            renderBody = () => {};
            render() { return <div />; }
        }`,
    ],
    invalid: [
        {
            code: `
            class IncorrectLifecycleComponent extends React.PureComponent<Props> {
                doSomething() {}
                componentDidMount() {}        // Error should report at line 4
                doSomethingArrow = () => {};
                onSomeChange() {}
                onSomeArrowChange = () => {};
                renderHead = () => {};
                renderBody = () => {};
                render() { return <div />; }
            }`,
            errors: [{line: 4, messageId}],
        },
        {
            code: `
            class IncorrectCustomRenderComponent extends React.PureComponent<Props> {
                renderHead = () => {};
                renderBody = () => {};
                componentDidMount() {}        // Error should report at line 5
                doSomething() {}              // Error should report at line 6
                doSomethingArrow = () => {};  // Error should report at line 7
                onSomeChange() {}             // Error should report at line 8
                onSomeArrowChange = () => {}; // Error should report at line 9
                render() { return <div />; }
            }`,
            errors: [
                {line: 5, messageId},
                {line: 6, messageId},
                {line: 7, messageId},
                {line: 8, messageId},
                {line: 9, messageId},
            ],
        },
        {
            code: `
            class IncorrectCustomRenderComponent extends React.PureComponent<Props> {
                componentDidMount() {}
                doSomething() {}
                doSomethingArrow = () => {};
                onSomeArrowChange = () => {};
                renderHead = () => {};
                renderBody = () => {};
                onSomeChange() {}             // Error should report at line 9
                render() { return <div />; }
            }`,
            errors: [{line: 9, messageId}],
        },
        {
            code: `
            class IncorrectCustomRenderComponent extends React.PureComponent<Props> {
                componentDidMount() {}
                doSomething() {}
                doSomethingArrow = () => {};
                onSomeChange() {}
                onSomeArrowChange = () => {};
                render() { return <div />; }
                renderHead = () => {};        // Error should report at 9
                renderBody = () => {};        // Error should report at 10
            }`,
            errors: [
                {line: 9, messageId},
                {line: 10, messageId},
            ],
        },
    ],
});
