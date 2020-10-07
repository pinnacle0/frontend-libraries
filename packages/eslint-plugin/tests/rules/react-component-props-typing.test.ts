import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/react-component-props-typing";
import {createConfig} from "../create-config";

const messageId: MessageIds = "reactComponentPropsTyping";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `class TypedPropsComponent extends React.Component<Props> {}
         class TypedPropsPureComponent extends React.PureComponent<Props> {}`,
        `(class TypedPropsClassExpressionComponent extends React.Component<Props> {});
         (class TypedPropsClassExpressionPureComponent extends React.PureComponent<Props> {});`,
        `(class extends React.Component<Props> {});
         (class extends React.PureComponent<Props> {});`,
        `class GenericTypedPropsComponent<T> extends React.Component<Props<T>> {}
         class GenericTypedPropsPureComponent<T> extends React.PureComponent<Props<T>> {}`,
        `class ConstrainedGenericTypedPropsComponent<T extends string> extends React.Component<Props<T>> {}
         class ConstrainedGenericTypedPropsPureComponent<T extends string> extends React.PureComponent<Props<T>> {}`,
        `class MultipleGenericTypedPropsComponent<T, U> extends React.Component<Props<T, U>> {}
         class MultipleGenericTypedPropsPureComponent<T, U> extends React.PureComponent<Props<T, U>> {}`,
        `class TypedPropsComponentWithState extends React.Component<Props, State> {}
         class TypedPropsPureComponentWithState extends React.PureComponent<Props, State> {}`,
        `class GenericTypedPropsComponentWithState<T> extends React.Component<Props<T>, State> {}
         class GenericTypedPropsPureComponentWithState<T> extends React.PureComponent<Props<T>, State> {}`,
        `class GenericTypedPropsComponentWithGenericState<T, U> extends React.Component<Props<T>, State<U>> {}
         class GenericTypedPropsPureComponentWithGenericState<T, U> extends React.PureComponent<Props<T>, State<U>> {}`,
        `class TooManyGenericsComponent<T, U, V, W> extends React.Component<Props<T, U>, State<V, W>> {}
         class TooManyGenericsPureComponent<T, U, V, W> extends React.PureComponent<Props<T, U>, State<V, W>> {}`,
        `class NotReactComponent extends NotReact.Component {}
         class NotReactPureComponent extends NotReact.PureComponent {}`,
        `(class NotReactClassExpressionComponent extends NotReact.Component {});
         (class NotReactClassExpressionPureComponent extends NotReact.PureComponent {});`,
        `(class extends NotReact.Component {});
         (class extends NotReact.PureComponent {});`,
        `class CurlyBracesPropsComponent extends React.Component<{}> {}
         class CurlyBracesPropsPureComponent extends React.PureComponent<{}> {}`,
        `class InlineTypedPropsComponent extends React.Component<{someProp: string}> {}
         class InlineTypedPropsPureComponent extends React.PureComponent<{someProp: string}> {}`,
        `class AnyTypedPropsComponent extends React.Component<any> {}
         class AnyTypedPropsPureComponent extends React.PureComponent<any> {}`,
        `class MappedTypedPropsComponent extends React.Component<{a: {}; b: {}}["a"]> {}
         class MappedTypedPropsPureComponent extends React.PureComponent<{a: {}; b: {}}["a"]> {}`,
        // `class DefaultPropsPickPropsComponent extends React.Component<Props> {
        //     static defaultProps: Pick<Props, "someProp" | "anotherProp"> = {};
        //     static unrelatedStaticMember1 = {};
        //     static unrelatedStaticMember2: Props = {};
        //     static unrelatedStaticMember3() {};
        // }
        // (class DefaultPropsPickGenericPropsClassExpressionPureComponent<T> extends React.PureComponent<Props<T>> {
        //     static defaultProps: Pick<Props<T>, "someProp" | "anotherProp"> = {};
        // });`,
    ],
    invalid: [
        {
            code: `
            class NoPropsGenericComponent extends React.Component {}
            class NoPropsGenericPureComponent extends React.PureComponent {}
            (class NoPropsGenericClassExpressionComponent extends React.Component {});
            (class NoPropsGenericClassExpressionPureComponent extends React.PureComponent {});
            (class extends React.Component {});
            (class extends React.PureComponent {});`,
            errors: [
                {line: 2, messageId},
                {line: 3, messageId},
                {line: 4, messageId},
                {line: 5, messageId},
                {line: 6, messageId},
                {line: 7, messageId},
            ],
        },
        {
            code: `
            connect(mapStateToProps)(
                class extends React.Component {}
            );
            connect(mapStateToProps)(
                class extends React.PureComponent {}
            );`,
            errors: [
                {line: 3, messageId},
                {line: 6, messageId},
            ],
        },
    ],
});
