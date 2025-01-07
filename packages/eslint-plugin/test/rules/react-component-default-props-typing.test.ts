import {RuleTester} from "@typescript-eslint/rule-tester";
import type {MessageIds} from "../../src/rules/react-component-default-props-typing.js";
import {name, rule} from "../../src/rules/react-component-default-props-typing.js";
import {createConfig} from "../create-config.js";

const incorrectDefaultPropsTypeAnnotationId: MessageIds = "incorrectDefaultPropsTypeAnnotation";
const incorrectPickOrPickOptionalTypeArgumentsId: MessageIds = "incorrectPickOrPickOptionalTypeArguments";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `class AComponent extends React.Component<T> {
            static defaultProps: Pick<T, "p1"> = {};
        }
        class APureComponent extends React.PureComponent<T> {
            static defaultProps: Pick<T, "p1" | "p2"> = {};
        }
        (class extends React.Component<Props> {
            static defaultProps: Pick<Props, any> = {};
        });
        (class extends React.PureComponent<Props> {
            static defaultProps: Pick<Props, any> = {};
        });`,
        `class AComponent extends React.Component<T> {
            static defaultProps: PickOptional<T> = {};
        }
        class APureComponent extends React.PureComponent<T> {
            static defaultProps: PickOptional<T> = {};
        }
        (class extends React.Component<Props> {
            static defaultProps: PickOptional<Props> = {};
        });
        (class extends React.PureComponent<Props> {
            static defaultProps: PickOptional<Props> = {};
        });`,
        `class GenericTypedPropsComponent<T> extends React.Component<Props<T>> {
            static defaultProps: Pick<Props<any>, SomeTypeRef> = {};
        }
        class GenericTypedPropsPureComponent<T> extends React.PureComponent<Props<T>> {
            static defaultProps: Pick<Props<any>, SomeTypeRef> = {};
        }
        class ManyGenericTypedPropsComponent<T, U, V> extends React.Component<Props<T, U, V>> {
            static defaultProps: Pick<Props<any, any, any>, string> = {};
        }
        class ManyGenericTypedPropsPureComponent<T, U, V> extends React.PureComponent<Props<T, U, V>> {
            static defaultProps: Pick<Props<any, any, any>, string> = {};
        }
        class NestedGenericTypedPropsComponent<T, U> extends React.Component<Props<Array<T>, Array<U>>> {
            static defaultProps: Pick<Props<Array<any>, Array<any>>, any> = {};
        }
        class NestedGenericTypedPropsPureComponent<T, U> extends React.PureComponent<Props<Array<T>, Array<U>>> {
            static defaultProps: Pick<Props<Array<any>, Array<any>>, any> = {};
        }`,
        `class GenericTypedPropsComponent<T> extends React.Component<Props<T>> {
            static defaultProps: PickOptional<Props<any>> = {};
        }
        class ManyGenericTypedPropsPureComponent<T, U, V> extends React.PureComponent<Props<T, U, V>> {
            static defaultProps: PickOptional<Props<any, any, any>> = {};
        }`,
        `class NotReactComponent extends NotReact.Component<T> {
            static defaultProps: Array<T> = {};
            static defaultProps = {};
            static defaultProps;
        }
        class UnrelatedPureComponent extends Unrelated.PureComponent<T> {
            static defaultProps: T = {};
            static defaultProps = {};
            static defaultProps;
        }`,
    ],
    invalid: [
        {
            code: `
            class NotAnnotatedWithPickOrPickOptionalGeneric extends React.Component<Props> {
                static defaultProps: SeemsCompatibleGeneric<Props, SomeTypeRef> = {};
                static defaultProps: FancyPick<Props, "p1" | "p2"> = {p1: "", p2: ""};
                static defaultProps: GenericWithThreeTypeParams<Props, "p2" | "p3", any> = {p2: "", p3: 0};
                static defaultProps: Array<Props> = [];
            }`,
            errors: [
                {line: 3, messageId: incorrectDefaultPropsTypeAnnotationId},
                {line: 4, messageId: incorrectDefaultPropsTypeAnnotationId},
                {line: 5, messageId: incorrectDefaultPropsTypeAnnotationId},
                {line: 6, messageId: incorrectDefaultPropsTypeAnnotationId},
            ],
        },
        {
            code: `
            class NotAnnotatedWithCorrectTypeAnnotation extends React.Component<Props> {
                static defaultProps: Props = {};
                static defaultProps: {a: string} = {a: ""};
                static defaultProps: unknown = {b: "", c: 0};
                static defaultProps: any = null;
                static defaultProps = null;
            }`,
            errors: [
                {line: 3, messageId: incorrectDefaultPropsTypeAnnotationId},
                {line: 4, messageId: incorrectDefaultPropsTypeAnnotationId},
                {line: 5, messageId: incorrectDefaultPropsTypeAnnotationId},
                {line: 6, messageId: incorrectDefaultPropsTypeAnnotationId},
                {line: 7, messageId: incorrectDefaultPropsTypeAnnotationId},
            ],
        },
        {
            code: `
            class IncorrectTypeReference2 extends React.Component<Props> {
                static defaultProps: Pick<Props> = {};
                static defaultProps: PickOptional = {};
                static defaultProps: Pick = {};
                static defaultProps: Pick<{p1: "", p2: ""}, "p1" | "p2"> = {p1: "", p2: ""}; // This should not error
                static defaultProps: Pick<Props, "p1"> = null as any;                        // This should not error
            }`,
            errors: [
                {line: 3, messageId: incorrectPickOrPickOptionalTypeArgumentsId},
                {line: 4, messageId: incorrectPickOrPickOptionalTypeArgumentsId},
                {line: 5, messageId: incorrectPickOrPickOptionalTypeArgumentsId},
            ],
        },
    ],
});
